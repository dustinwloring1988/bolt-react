'use client';

import { map, type MapStore } from 'nanostores';

export type LockStatus = 'unlocked' | 'locked';

export interface FileLock {
  filePath: string;
  status: LockStatus;
  lockedAt: number;
  lockedBy: 'user';
}

export type FileLocks = Record<string, FileLock>;

const STORAGE_KEY = 'bolt-file-locks';

function loadLocksFromStorage(): FileLocks {
  if (typeof window === 'undefined') {
    return {};
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load file locks from storage:', error);
  }
  return {};
}

function saveLocksToStorage(locks: FileLocks): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(locks));
  } catch (error) {
    console.error('Failed to save file locks to storage:', error);
  }
}

let fileLocksStoreInstance: MapStore<FileLocks> | null = null;

export class FileLocksStore {
  locks: MapStore<FileLocks>;

  constructor() {
    if (!fileLocksStoreInstance) {
      fileLocksStoreInstance = map<FileLocks>(loadLocksFromStorage());
    }
    this.locks = fileLocksStoreInstance;
  }

  getLock(filePath: string): FileLock | undefined {
    return this.locks.get()[filePath];
  }

  isLocked(filePath: string): boolean {
    const lock = this.getLock(filePath);
    return lock?.status === 'locked';
  }

  lockFile(filePath: string): void {
    const currentLocks = this.locks.get();
    
    if (currentLocks[filePath]?.status === 'locked') {
      return;
    }

    const newLock: FileLock = {
      filePath,
      status: 'locked',
      lockedAt: Date.now(),
      lockedBy: 'user',
    };

    this.locks.setKey(filePath, newLock);
    saveLocksToStorage(this.locks.get());
  }

  unlockFile(filePath: string): void {
    const currentLocks = this.locks.get();
    
    if (!currentLocks[filePath]) {
      return;
    }

    this.locks.setKey(filePath, undefined as any);
    saveLocksToStorage(this.locks.get());
  }

  toggleLock(filePath: string): void {
    if (this.isLocked(filePath)) {
      this.unlockFile(filePath);
    } else {
      this.lockFile(filePath);
    }
  }

  getLockedFiles(): FileLock[] {
    const locks = this.locks.get();
    return Object.values(locks).filter((lock): lock is FileLock => 
      lock !== undefined && lock.status === 'locked'
    );
  }

  getLockedFilePaths(): string[] {
    return this.getLockedFiles().map(lock => lock.filePath);
  }

  clearAllLocks(): void {
    this.locks.set({});
    saveLocksToStorage({});
  }
}

let fileLocksInstance: FileLocksStore | null = null;

export function getFileLocksStore(): FileLocksStore {
  if (!fileLocksInstance) {
    fileLocksInstance = new FileLocksStore();
  }
  return fileLocksInstance;
}

export const fileLocksStore = getFileLocksStore();
