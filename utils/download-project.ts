import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { WORK_DIR } from './constants';
import type { FileMap } from '@/lib/stores/files';

export async function downloadProjectAsZip(files: FileMap, projectName: string = 'project') {
  const zip = new JSZip();
  
  const fileEntries = Object.entries(files);
  
  if (fileEntries.length === 0) {
    return;
  }

  for (const [filePath, dirent] of fileEntries) {
    if (dirent?.type === 'file' && !dirent.isBinary) {
      const relativePath = filePath.startsWith(`${WORK_DIR}/`)
        ? filePath.slice(WORK_DIR.length + 1)
        : filePath;
      
      zip.file(relativePath, dirent.content);
    }
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, `${projectName}.zip`);
}
