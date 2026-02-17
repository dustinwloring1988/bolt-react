import type { GitHubImportProgress } from '@/types/github';
import { fetchRepoInfo, fetchRepoTree, getFileDownloadUrl } from './api';
import { webcontainer } from '@/lib/webcontainer';
import { workbenchStore } from '@/lib/stores/workbench';

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

const MAX_FILE_SIZE = 1024 * 1024; 

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

export async function cloneGitHubRepo(
  owner: string,
  repo: string,
  branch: string,
  onProgress: (progress: GitHubImportProgress) => void
): Promise<void> {
  onProgress({ stage: 'fetching', progress: 0 });

  await fetchRepoInfo(owner, repo); // Validate repo exists
  onProgress({ stage: 'fetching', progress: 20 });

  const tree = await fetchRepoTree(owner, repo, branch);
  onProgress({ stage: 'fetching', progress: 40 });

  const files = tree.tree.filter(
    (item) => item.type === 'blob' && !shouldIgnore(item.path) && (item.size || 0) < MAX_FILE_SIZE
  );

  onProgress({ stage: 'downloading', progress: 40, totalFiles: files.length });

  const wc = await webcontainer;

  // Clear the workdir before importing
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

  for (const file of files) {
    try {
      const downloadUrl = getFileDownloadUrl(owner, repo, branch, file.path);
      const response = await fetch(downloadUrl);
      
      if (!response.ok) continue;
      
      const content = await response.text();
      
      const filePath = file.path;
      
      const dirParts = filePath.split('/');
      dirParts.pop(); // Remove filename, keep directory parts
      
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

      await wc.fs.writeFile(filePath, content);
      
      processedFiles++;
      const progress = 40 + Math.floor((processedFiles / files.length) * 50);
      
      onProgress({
        stage: 'downloading',
        progress,
        currentFile: file.path,
        totalFiles: files.length,
      });
    } catch (err) {
      console.error(`Failed to download ${file.path}:`, err);
    }
  }

  const packageJsonExists = files.some(f => f.path === 'package.json');
  if (packageJsonExists) {
    onProgress({ stage: 'writing', progress: 95, currentFile: 'Installing dependencies...' });
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

export function getInitialPrompt(owner: string, repo: string, description: string | null): string {
  const desc = description ? `: ${description}` : '';
  return `I've imported the GitHub repository ${owner}/${repo}${desc}. 

Please do the following:
1. First, install any missing dependencies with \`npm install\`
2. Then start the development server with \`npm run dev\` (or the appropriate command)
3. Once the server is running, analyze the codebase and help me understand the project structure, then make any requested modifications or improvements.`;
}
