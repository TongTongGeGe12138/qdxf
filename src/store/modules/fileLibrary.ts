import { defineStore } from 'pinia';

interface FileItem {
  id: string | number;
  name: string;
  type: 'folder' | 'file';
  size?: string;
  createTime?: string;
  updateTime?: string;
  preview?: string;
  projectId?: string | number;
  fileId?: string | number;
  folderId?: string | number;
}

export const useFileLibraryStore = defineStore('fileLibrary', {
  state: () => ({
    currentPath: [] as string[],
    libraryList: [] as FileItem[]
  }),
  actions: {
    setCurrentPath(path: string[]) {
      this.currentPath = path;
      console.log(this.currentPath,777777);
      
    },
    clearCurrentPath() {
      this.currentPath = [];
      console.log(this.currentPath,888888);
    },
    setLibraryList(list: FileItem[]) {
      console.log('设置文件列表:', list);
      this.libraryList = list;
      console.log(this.libraryList,999999);
    }
  }
}); 