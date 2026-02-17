import type { GitHubRepoInfo, GitHubTreeResponse } from '@/types/github';

const GITHUB_API_BASE = 'https://api.github.com';

export async function fetchRepoInfo(owner: string, repo: string): Promise<GitHubRepoInfo> {
  const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Repository not found. Please check the URL and try again.');
    }
    if (response.status === 403) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    throw new Error(`Failed to fetch repository: ${response.statusText}`);
  }

  const data = await response.json();
  
  return {
    owner: data.owner.login,
    repo: data.name,
    branch: data.default_branch,
    defaultBranch: data.default_branch,
    description: data.description,
    stars: data.stargazers_count,
    language: data.language,
  };
}

export async function fetchRepoTree(owner: string, repo: string, branch: string): Promise<GitHubTreeResponse> {
  const response = await fetch(
    `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Branch not found. Please check the branch name.');
    }
    throw new Error(`Failed to fetch repository tree: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchFileContent(url: string): Promise<string> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.statusText}`);
  }

  return response.text();
}

export function getFileDownloadUrl(owner: string, repo: string, branch: string, path: string): string {
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
}
