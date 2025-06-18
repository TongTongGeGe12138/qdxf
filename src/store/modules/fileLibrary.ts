import { defineStore } from 'pinia';
import { getProjectResource, getProjectFile, getProjectResourceFile } from '@/api/project';
import { ElMessage } from 'element-plus';

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
  contentType?: number;
}

interface FolderInfo {
  id: string | number;
  name: string;
}

export const useFileLibraryStore = defineStore('fileLibrary', {
  state: () => ({
    currentPath: [] as string[],
    projectId: null as string | number | null,
    folderPath: [] as FolderInfo[],
    libraryList: [] as FileItem[]
  }),
  actions: {
    setCurrentPath(path: string[]) {
      this.currentPath = path;
    },
    clearCurrentPath() {
      this.currentPath = [];
      this.projectId = null;
      this.folderPath = [];
    },
    setLibraryList(list: FileItem[]) {
      this.libraryList = list;
    },
    async navigateUp() {
      if (this.currentPath.length > 0) {
        this.currentPath = this.currentPath.slice(0, -1);
        this.folderPath = this.folderPath.slice(0, -1);
        
        if (this.currentPath.length === 0) {
          this.projectId = null;
          this.folderPath = [];
          const res = await getProjectFile({
            page: 1,
            pageSize: 20,
            search: ''
          });
          if (res.code === 200) {
            const list = res.data.data.map((item: any) => ({
              ...item,
              type: item.length === 0 ? 'folder' : 'file'
            }));
            this.setLibraryList(list || []);
          }
        } else {
          const currentFolder = this.folderPath[this.folderPath.length - 1];
          const res = await getProjectResourceFile({
            projectId: this.projectId,
            folderId: currentFolder.id,
            page: 1,
            pageSize: 20
          });
          if (res.code === 200) {
            const list = res.data.data.map((item: any) => ({
              ...item,
              type: item.length === 0 ? 'folder' : 'file'
            }));
            this.setLibraryList(list || []);
          }
        }
      }
    },
    async navigateToFolder(folder: FileItem) {
      this.currentPath = [...this.currentPath, folder.name];
      
      if (this.currentPath.length === 1) {
        this.projectId = folder.id;
      }
      this.folderPath = [...this.folderPath, {
        id: folder.id,
        name: folder.name
      }];
      
      await this.refreshCurrentList();
    },
    async navigateToPath(index: number) {
      this.currentPath = this.currentPath.slice(0, index + 1);
      this.folderPath = this.folderPath.slice(0, index + 1);
      
      if (index === 0) {
        this.projectId = null;
        this.folderPath = [];
        const res = await getProjectFile({
          page: 1,
          pageSize: 20,
          search: ''
        });
        if (res.code === 200) {
          const list = res.data.data.map((item: any) => ({
            ...item,
            type: item.length === 0 ? 'folder' : 'file'
          }));
          this.setLibraryList(list || []);
        }
      } else {
        const targetFolder = this.folderPath[index - 1];
        const res = await getProjectResourceFile({
          projectId: this.projectId,
          folderId: targetFolder.id,
          page: 1,
          pageSize: 20
        });
        if (res.code === 200) {
          const list = res.data.data.map((item: any) => ({
            ...item,
            type: item.length === 0 ? 'folder' : 'file'
          }));
          this.setLibraryList(list || []);
        }
      }
    },
    async refreshCurrentList() {
      try {
        if (this.currentPath.length === 0) {
          const res = await getProjectFile({
            page: 1,
            pageSize: 20,
            search: ''
          });
          if (res.code === 200) {
            const list = res.data.data.map((item: any) => ({
              ...item,
              type: item.length === 0 ? 'folder' : 'file'
            }));
            this.setLibraryList(list || []);
          }
        } else {
          const currentFolder = this.folderPath[this.folderPath.length - 1];
          const res = await getProjectResourceFile({
            projectId: this.projectId,
            folderId: currentFolder.id,
            page: 1,
            pageSize: 20
          });
          if (res.code === 200) {
            const list = res.data.data.map((item: any) => ({
              ...item,
              type: item.length === 0 ? 'folder' : 'file'
            }));
            this.setLibraryList(list || []);
          }
        }
      } catch (error) {
        ElMessage.error('获取列表失败');
      }
    }
  }
}); 