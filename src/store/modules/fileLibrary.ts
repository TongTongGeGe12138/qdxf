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
    async  clearCurrentPath() {
      this.currentPath = [];
      this.projectId = null;
      this.folderPath = [];
      await this.refreshCurrentList(); // ✅ 修复关键
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
      try {
        // 先清空当前列表，避免显示旧数据
        this.setLibraryList([]);
        
        // 更新路径
        this.currentPath = this.currentPath.slice(0, index + 1);
        this.folderPath = this.folderPath.slice(0, index + 1);
        
        // 如果是根目录
        if (index === -1) {
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
          } else {
            throw new Error(res.message || '获取根目录数据失败');
          }
        } else {
          // 确保有projectId
          if (!this.projectId) {
            throw new Error('项目ID不存在');
          }
          
          // 获取目标文件夹
          const targetFolder = this.folderPath[index];
          if (!targetFolder) {
            throw new Error('目标文件夹不存在');
          }
          
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
          } else {
            throw new Error(res.message || '获取文件夹数据失败');
          }
        }
      } catch (error: any) {
        ElMessage.error(error.message || '导航失败');
        // 发生错误时回退到上一个状态
        this.refreshCurrentList();
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
          } else {
            throw new Error(res.message || '获取根目录数据失败');
          }
        } else {
          // 确保有projectId和当前文件夹
          if (!this.projectId) {
            throw new Error('项目ID不存在');
          }
          
          const currentFolder = this.folderPath[this.folderPath.length - 1];
          if (!currentFolder) {
            throw new Error('当前文件夹不存在');
          }
          
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
          } else {
            throw new Error(res.message || '获取文件夹数据失败');
          }
        }
      } catch (error: any) {
        ElMessage.error(error.message || '获取列表失败');
        // 发生错误时清空列表
        this.setLibraryList([]);
      }
    }
  }
}); 