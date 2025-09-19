import type { ProjectListResult } from '@/api/model/detailModel';
import { request } from '@/utils/request';

const Api = {
  AigcUrl: '/aigc/category',
  ComponentUrl: '/aigc/component'
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
