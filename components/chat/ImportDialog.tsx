"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Github, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  GitBranch,
  Sparkles
} from 'lucide-react';
import { parseGitHubUrl, type GitHubImportProgress } from '@/types/github';
import { fetchRepoInfo } from '@/lib/github/api';
import { cloneGitHubRepo, getInitialPrompt } from '@/lib/github/clone-repo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: (prompt: string) => void;
}

type ImportState = 'idle' | 'validating' | 'importing' | 'complete' | 'error';

export function ImportDialog({ open, onOpenChange, onImportComplete }: ImportDialogProps) {
  const [url, setUrl] = useState('');
  const [repoInfo, setRepoInfo] = useState<{ owner: string; repo: string; description: string | null } | null>(null);
  const [importState, setImportState] = useState<ImportState>('idle');
  const [progress, setProgress] = useState<GitHubImportProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setRepoInfo(null);
    setError(null);
    setImportState('idle');
  };

  const handleValidate = async () => {
    const parsed = parseGitHubUrl(url);
    if (!parsed) {
      setError('Invalid GitHub URL. Please enter a valid repository URL.');
      return;
    }

    setImportState('validating');
    setError(null);

    try {
      const info = await fetchRepoInfo(parsed.owner, parsed.repo);
      setRepoInfo({ owner: info.owner, repo: info.repo, description: info.description });
      setImportState('idle');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to validate repository');
      setImportState('idle');
    }
  };

  const handleImport = async () => {
    if (!repoInfo) return;

    setImportState('importing');
    setError(null);

    try {
      await cloneGitHubRepo(
        repoInfo.owner,
        repoInfo.repo,
        'main',
        setProgress
      );
      setImportState('complete');
      
      const prompt = getInitialPrompt(repoInfo.owner, repoInfo.repo, repoInfo.description);
      onImportComplete(prompt);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import repository');
      setImportState('error');
    }
  };

  const handleClose = () => {
    setUrl('');
    setRepoInfo(null);
    setImportState('idle');
    setProgress(null);
    setError(null);
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
                  <GitBranch className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">Import Repository</h2>
                  <p className="text-sm text-muted-foreground">Clone a GitHub repo to get started</p>
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
                      {progress.stage === 'fetching' && 'Fetching repository...'}
                      {progress.stage === 'downloading' && `Downloading files... ${progress.currentFile}`}
                      {progress.stage === 'writing' && 'Setting up project...'}
                      {progress.stage === 'complete' && 'Import complete!'}
                    </span>
                  </div>
                  
                  {progress.stage !== 'complete' && (
                    <Progress value={progress.progress} className="h-2" />
                  )}
                  
                  {progress.totalFiles && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {progress.stage === 'downloading' 
                        ? `${Math.round((progress.progress || 0) / 100 * progress.totalFiles)} / ${progress.totalFiles} files`
                        : 'Please wait...'}
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Repository URL
                      </label>
                      <div className="relative">
                        <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="https://github.com/owner/repository"
                          value={url}
                          onChange={handleUrlChange}
                          className="pl-10 bg-background/50 border-border/50 focus:border-primary/50"
                          onKeyDown={(e) => e.key === 'Enter' && !repoInfo && handleValidate()}
                          disabled={importState === 'validating'}
                        />
                      </div>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20"
                      >
                        <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                        <p className="text-sm text-destructive">{error}</p>
                      </motion.div>
                    )}

                    {repoInfo && !error && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border border-primary/20"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center border border-border/50">
                              <Github className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium">{repoInfo.owner}/{repoInfo.repo}</p>
                              {repoInfo.description && (
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {repoInfo.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        </div>
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
                    
                    {!repoInfo ? (
                      <Button
                        onClick={handleValidate}
                        disabled={!url || importState === 'validating'}
                        className="flex-1"
                      >
                        {importState === 'validating' ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Validating...
                          </>
                        ) : (
                          <>
                            Validate
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        onClick={handleImport}
                        disabled={importState === 'importing'}
                        className="flex-1 bg-gradient-to-r from-primary to-primary/80"
                      >
                        {importState === 'importing' ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Importing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Import & Start
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  <p className="mt-4 text-xs text-center text-muted-foreground">
                    Only public repositories are supported. Large files may take longer to import.
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
