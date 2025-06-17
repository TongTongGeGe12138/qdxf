import { defineStore } from 'pinia';
import { getProjectResource, getProjectFile } from '@/api/project';
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
}

export const useFileLibraryStore = defineStore('fileLibrary', {
  state: () => ({
    currentPath: [] as string[],
    libraryList: [] as FileItem[]
  }),
  actions: {
    setCurrentPath(path: string[]) {
      this.currentPath = path;
    },
    clearCurrentPath() {
      this.currentPath = [];
    },
    setLibraryList(list: FileItem[]) {
      this.libraryList = list;
    },
    async navigateUp() {
      if (this.currentPath.length > 0) {
        this.currentPath = this.currentPath.slice(0, -1);
        await this.refreshCurrentList();
      }
    },
    async navigateToFolder(folder: FileItem) {
      this.currentPath = [...this.currentPath, folder.name];
      await this.refreshCurrentList();
    },
    async navigateToPath(index: number) {
      this.currentPath = this.currentPath.slice(0, index + 1);
      await this.refreshCurrentList();
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
          const currentFolder = this.libraryList.find(folder => folder.name === this.currentPath[this.currentPath.length - 1]);
          if (currentFolder?.id) {
            const res = await getProjectResource({
              projectId: currentFolder.id,
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
      } catch (error) {
        ElMessage.error('获取列表失败');
      }
    }
  }
}); 