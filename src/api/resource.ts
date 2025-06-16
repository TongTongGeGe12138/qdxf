import type { ProjectListResult } from '@/api/model/detailModel';
import { request } from '@/utils/request';

const Api = {
  ResourceUrl: '/my/resource/category',
  FlieUrl: '/my/resource',
};

// 获取我的资源分类(根级分类)
export function getResourcesList() {
  return request.get<ProjectListResult>({
    url: Api.ResourceUrl,
  });
}

// 获取我的资源分类(子级分类)
export function getResourcesChildren(parentId: any) {
  return request.get<ProjectListResult>({
    url: `${Api.ResourceUrl}/${parentId}`,
  });
}

// 获取我的资源文件列表
export function getResourceFiles(data: any) {
  return request.get<ProjectListResult>({
    url: `${Api.FlieUrl}/files/${data.pageSize ? `?pageSize=${data.pageSize}` : '?pageSize=10'}${
      data.search ? `&search=${data.search}` : ''
    }${data.page ? `&page=${data.page}` : ''}${data.folderId ? `&folderId=${data.folderId}` : ''}`,
  });
}

// 获取我的资源文件信息（根据文件id）
export function getMyResourcesInfo(id: any) {
  return request.get<ProjectListResult>({
    url: `${Api.FlieUrl}/file/${id}`,
  });
}

// 下载我的资源文件（根据文件id）
export function downloadResourcesFile(id: any) {
  return request.get({
    url: `${Api.FlieUrl}/file/${id}/content`,
    responseType: 'blob',
  });
}

// 删除我的资源文件（根据文件id）
export function deleteResourcesFile(id: any) {
  return request.delete<ProjectListResult>({
    url: `${Api.FlieUrl}/${id}`,
  });
} 