import type { ProjectListResult } from '@/api/model/detailModel';
import { request } from '@/utils/request';

const Api = {
  DictUrl: '/dict/',
  ProfessionUrl: '/dict/profession',
  BeeUrl: '/bee/resource',
  ProfessionalUrl: '/dict/professional-qualification',
};

// // 获取字典数据
// export function getDictList(code: any) {
//   return request.get<ProjectListResult>({
//     url: `${Api.DictUrl}${code}`,
//   });
// }
// // 获取字典数据树结构
// export function getDictTreePathList(data: any) {
//   return request.get<ProjectListResult>({
//     url: `${Api.DictUrl}${data.code}/tree/${data.path}`,
//   });
// }
// // 获取字典数据树结构
// export function getDictTreeList(code: any) {
//   return request.get<ProjectListResult>({
//     url: `${Api.DictUrl}${code}/tree`,
//   });
// }
// 获取专业身份列表
export function getProfessionList() {
  return request.get<ProjectListResult>({
    url: Api.ProfessionUrl,
  });
}
// 获取职业资格列表
export function getProfessionalList() {
  return request.get<ProjectListResult>({
    url: Api.ProfessionalUrl,
  });
}

// 蜂资源相关接口(第一级分类)
export function getBeeResources(path: any) {
  return request.get<ProjectListResult>({
    url: `${Api.BeeUrl}/${path}`,
  });
}
// 蜂资源相关接口(第二级分类)
export function getBeeResourcesSecond(data: any) {
  return request.get<ProjectListResult>({
    url: `${Api.BeeUrl}/${data.category}/${data.lv1}`,
  });
}
// 蜂资源:获取文件列表(顶级分类下的文件)
export function getTopLevelFiles(data: any) {
  return request.get<ProjectListResult>({
    url: `${Api.BeeUrl}/${data.category}/files${data.all ? '?all=false' : '?all=true'}${
      data.search ? `&search=${data.search}` : ''
    }${data.page ? `&page=${data.page}` : ''}${data.pageSize ? `&pageSize=${data.pageSize}` : ''}`,
  });
}
// 蜂资源:获取文件列表(第一级分类下的文件)
export function getFistLevelFiles(data: any) {
  return request.get<ProjectListResult>({
    url: `${Api.BeeUrl}/${data.category}/${data.fist}/files${data.all ? '?all=false' : '?all=true'}${
      data.search ? `&search=${data.search}` : ''
    }${data.page ? `&page=${data.page}` : ''}${data.pageSize ? `&pageSize=${data.pageSize}` : ''}`,
  });
}
// 蜂资源:获取文件列表(第二级分类下的文件)(废弃)
export function getSecondLevelFiles(data: any) {
  return request.get<ProjectListResult>({
    url: `${Api.BeeUrl}/${data.category}/${data.fist}/${data.second}/files${data.all ? '?all=false' : '?all=true'}${
      data.search ? `&search=${data.search}` : ''
    }${data.page ? `&page=${data.page}` : ''}${data.pageSize ? `&pageSize=${data.pageSize}` : ''}`,
  });
}
// 蜂资源:获取文件列表(第二级分类下的文件)
export function getSecondLevelListApi(data: any) {
  return request.get<ProjectListResult>({
    url: `${Api.BeeUrl}/folder/${data.id}/list${data.all ? '?all=false' : '?all=true'}${
      data.search ? `&search=${data.search}` : ''
    }${data.page ? `&page=${data.page}` : ''}${data.pageSize ? `&pageSize=${data.pageSize}` : ''}`,
  });
}
// 蜂资源相关接口: 获取文件信息（根据文件id）
export function getResourcesInfo(id: any) {
  return request.get<ProjectListResult>({
    url: `${Api.BeeUrl}/file/${id}`,
  });
}
// 蜂资源相关接口: 下载文件（根据文件id）
export function downloadFile(id: any) {
  return request.get<ProjectListResult>({
    url: `${Api.BeeUrl}/file/${id}/content`,
  });
}

// 把资源加入我的资源
export function addMyResource(fileId: any) {
  return request.post<ProjectListResult>({
    url: `${Api.BeeUrl}/file/${fileId}/my`,
  });
}
