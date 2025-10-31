import type { ProjectListResult } from '@/api/model/detailModel';
import { request } from '@/utils/request';

const Api = {
  AigcUrl: '/aigc/category',
  ComponentUrl: '/aigc/component',
  ProjectUrl: '/aigc/project'
};

/**
 * 获取AIGC组件分类（第一级）
 */
export function getAigcPrimaryList(): Promise<ProjectListResult> {
  return request.get<ProjectListResult>({
    url: Api.AigcUrl,
  });
}

/**
 * 获取AIGC组件分类（子级）
 * @param categoryPath - 分类路径
 */
export function getAigcChildrenList(categoryPath: string | number ,version?: number): Promise<ProjectListResult> {
  return request.get<ProjectListResult>({
    url: `${Api.AigcUrl}/${categoryPath}`,
    params: version !== undefined ? { version } : undefined
  });
}

/**
 * 获取AIGC所有模块
 */
export function getAigcAllList(): Promise<ProjectListResult> {
  return request.get<ProjectListResult>({
    url: `${Api.ComponentUrl}/all`
  });
}

/**
 * 获取AIGC项目列表
 * @param page - 页码
 * @param pageSize - 每页数量
 * @param search - 搜索关键词
 */
export function getAigcProjectList(page: number = 1, pageSize: number = 100, search?: string): Promise<ProjectListResult> {
  return request.get<ProjectListResult>({
    url: Api.ProjectUrl,
    params: { page, pageSize, ...(search ? { search } : {}) }
  });
}

/**
 * 获取AIGC项目详情
 * @param id - 项目ID
 */
export function getAigcProjectDetail(id: string): Promise<ProjectListResult> {
  return request.get<ProjectListResult>({
    url: `${Api.ProjectUrl}/${id}`
  });
}

/**
 * 删除AIGC项目
 * @param id - 项目ID
 */
export function deleteAigcProject(id: string): Promise<ProjectListResult> {
  return request.delete<ProjectListResult>({
    url: `${Api.ProjectUrl}/${id}`
  });
}
