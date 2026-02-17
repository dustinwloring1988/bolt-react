export interface GitHubRepoInfo {
  owner: string;
  repo: string;
  branch: string;
  defaultBranch: string;
  description: string | null;
  stars: number;
  language: string | null;
}

export interface GitHubFile {
  path: string;
  content: string;
  size: number;
  type: 'file' | 'directory';
}

export interface GitHubTreeItem {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
  url: string;
}

export interface GitHubTreeResponse {
  sha: string;
  url: string;
  tree: GitHubTreeItem[];
  truncated: boolean;
}

export interface GitHubImportProgress {
  stage: 'fetching' | 'downloading' | 'writing' | 'complete' | 'error';
  currentFile?: string;
  progress?: number;
  totalFiles?: number;
  error?: string;
}

export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const patterns = [
    /github\.com\/([^\/]+)\/([^\/]+)/,
    /github\.com\/([^\/]+)\/([^\/]+?)(?:\.git)?$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
    }
  }
  return null;
}

export function buildGitHubFileUrl(owner: string, repo: string, branch: string, path: string): string {
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
}
