import type { ProjectListResult } from '@/api/model/detailModel';
import { request } from '@/utils/request';

const Api = {
  ProjectUrl: '/my/project',
  ProjectFileUrl: '/my/project/resource',
  ProjectFileAddUrl: '/my/project/resource/file',
  TrashedUrl: '/my/project/resource/trashed',
};

// 获取项目列表（基于项目信息）（一级）
export function getProjectFolderList() {
  return request.get<ProjectListResult>({
    url: Api.ProjectUrl,
  });
}

// 创建项目（文件夹形式）（一级）
export function addProjectFolder(data: any) {
  return request.post<ProjectListResult>({
    url: Api.ProjectUrl,
    data,
  });
}

// 获取移动到事件项目列表（基于项目根资源）（一级）
export function getMoveFolderList() {
  return request.get<ProjectListResult>({
    url: `${Api.ProjectFileUrl}?all=true&folders=true`,
  });
}

// 获取项目列表（基于项目根资源）（一级）
export function getProjectFile(data: any) {
  return request.get<ProjectListResult>({
    url: `${Api.ProjectFileUrl}?page=${data.page || 1}&pageSize=${data.pageSize || 10}&search=${data.search || ''}`,
  });
}

// 获取项目信息（根据项目id）（一级）
export function getProjectFoldeInfo(projectId: any) {
  return request.get<ProjectListResult>({
    url: `${Api.ProjectUrl}/${projectId}`,
  });
}

// 修改项目信息（根据项目id）（一级）
export function editProjectFoldeInfo(data: any) {
  return request.post<ProjectListResult>({
    url: `${Api.ProjectUrl}/${data.projectId}`,
    data,
  });
}

// 删除项目（根据项目id）（一级）
export function deleteProjectFolder(projectId: any) {
  return request.delete<ProjectListResult>({
    url: `${Api.ProjectUrl}/${projectId}`,
  });
}

// 创建项目（文件上传形式）（一级）
export function addProjectFile(data: any) {
  return request.post<ProjectListResult>({
    url: Api.ProjectFileAddUrl,
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

// 获取项目资源（根据项目id）（二级）
export function getProjectResource(data: any) {
  return request.get<ProjectListResult>({
    url: `${Api.ProjectUrl}/${data.projectId}/resource?page=${data.page || 1}&pageSize=${data.pageSize || 10}&search=${
      data.search || ''
    }`,
  });
}

// 创建项目资源文件夹（二级）
export function addProjectResource(data: any) {
  return request.post<ProjectListResult>({
    url: `${Api.ProjectUrl}/${data.projectId}/resource/folder/name/${data.name}`,
  });
}

// 重命名项目资源文件夹（二级）
export function editProjectResource(data: any) {
  return request.put<ProjectListResult>({
    url: `${Api.ProjectUrl}/${data.projectId}/resource/folder/${data.folderId}/name/${data.name}`,
  });
}

// 删除项目资源文件夹（二级）
export function deleteProjectResource(data: any) {
  return request.delete<ProjectListResult>({
    url: `${Api.ProjectUrl}/${data.projectId}/resource/folder/${data.folderId}`,
  });
}

// 上传项目资源文件（根据项目id和文件夹id）（二级）
export function addProjectResourceFile(data: any) {
  return request.post<ProjectListResult>({
    url: `${Api.ProjectUrl}/${data.projectId}/resource/folder/${data.folderId}/file`,
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

// 创建项目资源文件夹（n级）
export function addThirdResource(data: any) {
  return request.post<ProjectListResult>({
    url: `${Api.ProjectUrl}/${data.projectId}/resource/folder/${data.folderId}/name/${data.name}`,
  });
}

// 获取项目资源（根据项目id和文件夹id）（n级）
export function getProjectResourceFile(data: any) {
  return request.get<ProjectListResult>({
    url: `${Api.ProjectUrl}/${data.projectId}/resource/${data.folderId}?page=${data.page || 1}&pageSize=${
      data.pageSize || 10
    }&search=${data.search || ''}`,
  });
}

// 获取项目资源文件信息（n级）
export function getProjectResourceFileInfo(data: any) {
  return request.get<ProjectListResult>({
    url: `${Api.ProjectUrl}/${data.projectId}/resource/file/${data.fileId}`,
  });
}

// 下载项目资源文件（n级）
export function downProjectResourceFile(data: any) {
  return request.get({
    url: `${Api.ProjectUrl}/${data.projectId}/resource/file/${data.fileId}/content`,
    responseType: 'blob',
  });
}

// 重命名项目资源文件
export function editProjectResourceFile(data: any) {
  return request.get<ProjectListResult>({
    url: `${Api.ProjectUrl}/${data.projectId}/resource/file/${data.fileId}/name/${data.name}`,
  });
}

// 删除项目资源文件（n级）
export function deleteProjectResourceFile(data: any) {
  return request.delete<ProjectListResult>({
    url: `${Api.ProjectUrl}/${data.projectId}/resource/file/${data.fileId}`,
  });
}

// 把项目资源放入回收站
export function transhFile(data: any) {
  return request.post<ProjectListResult>({
    url: `${Api.ProjectUrl}/${data.projectId}/resource/${data.id}/trash`,
  });
}

// 把项目资源从回收站恢复
export function recoverFile(data: any) {
  return request.post<ProjectListResult>({
    url: `${Api.ProjectUrl}/${data.projectId}/resource/trashed/${data.id}/recover`,
  });
}

// 获取回收站项目资源
export function getTrashedList(data: any) {
  return request.get<ProjectListResult>({
    url: `${Api.TrashedUrl}?page=${data.page || 1}&pageSize=${data.pageSize || 10}&search=${
      data.search || ''
    }&all=true${data.createdFrom ? `&createdFrom=${data.createdFrom}` : ''}${
      data.createdTo ? `&createdTo=${data.createdTo}` : ''
    }`,
  });
}

// 验证文件名是否有重名
export function getNameInspect(data: any) {
  return request.get<ProjectListResult>({
    url: `${Api.ProjectFileUrl}/folder/${data.folderId}/${data.name}/id`,
  });
}

// 获取项目相关配置
export function getSettings() {
  return request.get<ProjectListResult>({
    url: `${Api.ProjectUrl}/settings`,
  });
} 