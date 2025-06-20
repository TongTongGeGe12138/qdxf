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
    libraryList: [] as FileItem[],
    total: 0
  }),
  actions: {
    setCurrentPath(path: string[]) {
      this.currentPath = path;
    },
    async clearCurrentPath(autoRefresh = true, page = 1, pageSize = 20) {
      this.currentPath = [];
      this.projectId = null;
      this.folderPath = [];
      if (autoRefresh) {
        await this.refreshCurrentList(page, pageSize);
      }
    },
    setLibraryList(list: FileItem[]) {
      this.libraryList = list;
    },
    setTotal(total: number) {
      this.total = total;
    },
    async navigateUp(page = 1, pageSize = 20) {
      if (this.currentPath.length > 0) {
        this.currentPath = this.currentPath.slice(0, -1);
        this.folderPath = this.folderPath.slice(0, -1);

        if (this.currentPath.length === 0) {
          this.projectId = null;
          this.folderPath = [];
          await this.refreshCurrentList(page, pageSize);
        } else {
          const currentFolder = this.folderPath[this.folderPath.length - 1];
          const res = await getProjectResourceFile({
            projectId: this.projectId,
            folderId: currentFolder.id,
            page,
            pageSize
          });
          if (res.code === 200) {
            const list = res.data.data.map((item: any) => ({
              ...item,
              type: item.length === 0 ? 'folder' : 'file'
            }));
            this.setLibraryList(list || []);
            this.setTotal(res.data.total || 0);
          }
        }
      }
    },
    async navigateToFolder(folder: FileItem, page = 1, pageSize = 20) {
      this.currentPath = [...this.currentPath, folder.name];

      if (this.currentPath.length === 1) {
        this.projectId = folder.id;
      }
      this.folderPath = [...this.folderPath, {
        id: folder.id,
        name: folder.name
      }];

      await this.refreshCurrentList(page, pageSize);
    },
    async navigateToPath(index: number, page = 1, pageSize = 20) {
      try {
        this.setLibraryList([]);
        this.currentPath = this.currentPath.slice(0, index + 1);
        this.folderPath = this.folderPath.slice(0, index + 1);

        if (index === -1) {
          this.projectId = null;
          this.folderPath = [];
          await this.refreshCurrentList(page, pageSize);
        } else {
          if (!this.projectId) throw new Error('项目ID不存在');
          const targetFolder = this.folderPath[index];
          if (!targetFolder) throw new Error('目标文件夹不存在');

          const res = await getProjectResourceFile({
            projectId: this.projectId,
            folderId: targetFolder.id,
            page,
            pageSize
          });
          if (res.code === 200) {
            const list = res.data.data.map((item: any) => ({
              ...item,
              type: item.length === 0 ? 'folder' : 'file'
            }));
            this.setLibraryList(list || []);
            this.setTotal(res.data.total || 0);
          } else {
            throw new Error(res.message || '获取文件夹数据失败');
          }
        }
      } catch (error: any) {
        ElMessage.error(error.message || '导航失败');
        this.refreshCurrentList(page, pageSize);
      }
    },
    async refreshCurrentList(page = 1, pageSize = 20) {
      try {
        if (this.currentPath.length === 0) {
          const res = await getProjectFile({ page, pageSize, search: '' });
          if (res.code === 200) {
            const list = res.data.data.map((item: any) => ({
              ...item,
              type: item.length === 0 ? 'folder' : 'file'
            }));
            this.setLibraryList(list || []);
            this.setTotal(res.data.total || 0);
          } else {
            throw new Error(res.message || '获取根目录数据失败');
          }
        } else {
          if (!this.projectId) throw new Error('项目ID不存在');
          const currentFolder = this.folderPath[this.folderPath.length - 1];
          if (!currentFolder) throw new Error('当前文件夹不存在');

          const res = await getProjectResourceFile({
            projectId: this.projectId,
            folderId: currentFolder.id,
            page,
            pageSize
          });
          if (res.code === 200) {
            const list = res.data.data.map((item: any) => ({
              ...item,
              type: item.length === 0 ? 'folder' : 'file'
            }));
            this.setLibraryList(list || []);
            this.setTotal(res.data.total || 0);
          } else {
            throw new Error(res.message || '获取文件夹数据失败');
          }
        }
      } catch (error: any) {
        ElMessage.error(error.message || '获取列表失败');
        this.setLibraryList([]);
        this.setTotal(0);
      }
    }
  }
});
