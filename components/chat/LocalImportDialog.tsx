"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderOpen, 
  Loader2, 
  CheckCircle2,
  Upload
} from 'lucide-react';
import { importLocalFolder, getLocalImportInitialPrompt, type LocalImportProgress } from '@/lib/local-import/import-local';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface LocalImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: (prompt: string) => void;
}

type ImportState = 'idle' | 'importing' | 'complete' | 'error';

export function LocalImportDialog({ open, onOpenChange, onImportComplete }: LocalImportDialogProps) {
  const [importState, setImportState] = useState<ImportState>('idle');
  const [progress, setProgress] = useState<LocalImportProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectFolder = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setImportState('importing');
    setError(null);

    try {
      const firstFile = files[0];
      const path = firstFile.webkitRelativePath || firstFile.name;
      const name = path.split('/')[0] || 'project';

      await importLocalFolder(files, setProgress);
      setImportState('complete');
      
      const prompt = getLocalImportInitialPrompt(name);
      onImportComplete(prompt);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import folder');
      setImportState('error');
    }
  };

  const handleClose = () => {
    setImportState('idle');
    setProgress(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onOpenChange(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg mx-4 overflow-hidden rounded-2xl border border-border/50 bg-card shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
            
            <div className="relative p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                  <FolderOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">Import Local Project</h2>
                  <p className="text-sm text-muted-foreground">Select a local folder to import</p>
                </div>
              </div>

              {importState === 'importing' && progress ? (
                <div className="py-8">
                  <div className="flex items-center gap-3 mb-4">
                    {progress.stage === 'complete' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    )}
                    <span className="text-sm font-medium">
                      {progress.stage === 'reading' && 'Reading folder...'}
                      {progress.stage === 'importing' && `Importing files... ${progress.currentFile}`}
                      {progress.stage === 'complete' && 'Import complete!'}
                    </span>
                  </div>
                  
                  {progress.stage !== 'complete' && (
                    <Progress value={progress.progress} className="h-2" />
                  )}
                  
                  {progress.totalFiles && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {progress.stage === 'importing' 
                        ? `${Math.round((progress.progress - 50) / 40 * progress.totalFiles)} / ${progress.totalFiles} files`
                        : 'Please wait...'}
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      webkitdirectory=""
                      directory=""
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <button
                      onClick={handleSelectFolder}
                      className="w-full p-8 rounded-xl border-2 border-dashed border-border/50 
                               hover:border-primary/50 hover:bg-primary/5 transition-all duration-300
                               flex flex-col items-center gap-3 group"
                    >
                      <div className="h-14 w-14 rounded-full bg-secondary/30 flex items-center justify-center
                                      group-hover:scale-110 transition-transform duration-300">
                        <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-foreground">Click to select folder</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Select a project folder from your computer
                        </p>
                      </div>
                    </button>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20"
                      >
                        <p className="text-sm text-destructive">{error}</p>
                      </motion.div>
                    )}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button
                      variant="outline"
                      onClick={handleClose}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>

                  <p className="mt-4 text-xs text-center text-muted-foreground">
                    Large folders may take longer to import. Dependencies will be installed automatically.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
