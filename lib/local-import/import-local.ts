import { webcontainer } from '@/lib/webcontainer';
import { workbenchStore } from '@/lib/stores/workbench';

export interface LocalImportProgress {
  stage: 'reading' | 'importing' | 'complete' | 'error';
  progress: number;
  currentFile?: string;
  totalFiles?: number;
}

const IGNORE_PATTERNS = [
  'node_modules',
  '.git',
  '.github',
  '.gitignore',
  '.DS_Store',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  '.next',
  'dist',
  'build',
  '.cache',
  '.parcel-cache',
  'coverage',
  '.nyc_output',
  '*.log',
  'npm-debug.log*',
  'yarn-debug.log*',
  'yarn-error.log*',
  '.env',
  '.env.local',
  '.env.development',
  '.env.production',
  '__pycache__',
  '*.pyc',
  '.venv',
  'venv',
];

function shouldIgnore(path: string): boolean {
  const pathParts = path.split('/');
  for (const pattern of IGNORE_PATTERNS) {
    if (pattern.startsWith('*')) {
      const ext = pattern.slice(1);
      if (path.endsWith(ext)) {
        return true;
      }
    } else if (pathParts.includes(pattern)) {
      return true;
    }
  }
  return false;
}

export async function importLocalFolder(
  files: FileList | File[],
  onProgress: (progress: LocalImportProgress) => void
): Promise<void> {
  onProgress({ stage: 'reading', progress: 0 });

  const fileArray = Array.from(files);
  const filteredFiles = fileArray.filter(file => !shouldIgnore(file.webkitRelativePath || file.name));

  onProgress({ stage: 'reading', progress: 50, totalFiles: filteredFiles.length });

  const wc = await webcontainer;

  try {
    const workdirFiles = await wc.fs.readdir('.');
    for (const file of workdirFiles) {
      try {
        await wc.fs.rm(file, { recursive: true, force: true });
      } catch {
        // Ignore errors when clearing files
      }
    }
  } catch {
    // Workdir might be empty or not exist
  }

  let processedFiles = 0;

  onProgress({ stage: 'importing', progress: 50, totalFiles: filteredFiles.length });

  for (const file of filteredFiles) {
    try {
      const relativePath = file.webkitRelativePath || file.name;
      
      if (shouldIgnore(relativePath)) {
        continue;
      }

      const dirParts = relativePath.split('/');
      dirParts.pop();
      
      if (dirParts.length > 0) {
        let currentPath = '';
        for (const dir of dirParts) {
          currentPath += (currentPath ? '/' : '') + dir;
          try {
            await wc.fs.mkdir(currentPath, { recursive: true });
          } catch {
            // Ignore if directory already exists
          }
        }
      }

      const content = await file.text();
      await wc.fs.writeFile(relativePath, content);
      
      processedFiles++;
      const progress = 50 + Math.floor((processedFiles / filteredFiles.length) * 40);
      
      onProgress({
        stage: 'importing',
        progress,
        currentFile: relativePath,
        totalFiles: filteredFiles.length,
      });
    } catch (err) {
      console.error(`Failed to import ${file.name}:`, err);
    }
  }

  const hasPackageJson = filteredFiles.some(f => (f.webkitRelativePath || f.name) === 'package.json');
  if (hasPackageJson) {
    onProgress({ stage: 'importing', progress: 95, currentFile: 'Installing dependencies...' });
    try {
      const installProcess = await wc.spawn('npm', ['install']);
      await installProcess.exit;
    } catch (err) {
      console.error('Failed to install dependencies:', err);
    }
  }

  onProgress({ stage: 'complete', progress: 100 });

  workbenchStore.setShowWorkbench(true);
}

export function getLocalImportInitialPrompt(folderName: string): string {
  return `I've imported a local project folder "${folderName}". 

Please do the following:
1. First, install any missing dependencies with \`npm install\`
2. Then start the development server with \`npm run dev\` (or the appropriate command)
3. Once the server is running, analyze the codebase and help me understand the project structure, then make any requested modifications or improvements.`;
}
