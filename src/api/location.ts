import type { ProjectListResult } from '@/api/model/detailModel';
import { request } from '@/utils/request';

const Api = {
  ProvinceListUrl: '/location/china/province',
  CityListUrl: '/location/china/province',
  DistrictListUrl: '/location/china/city',
  ParentidListUrl: '/location',
};

// 获取中国一级（省级）地区列表
export function getProvinceList() {
  return request.get<ProjectListResult>({
    url: Api.ProvinceListUrl,
  });
}

// 获取中国二级（市级）地区列表
export function getCityList(provinceid: any) {
  return request.get<ProjectListResult>({
    url: `${Api.ProvinceListUrl}/${provinceid}/city`,
  });
}

// 获取中国三级（区级）地区列表
export function getDistrictList(cityid: any) {
  return request.get<ProjectListResult>({
    url: `${Api.DistrictListUrl}/${cityid}/district`,
  });
}

// 获取子级地区列表
export function getParentidList(parentid: any) {
  return request.get<ProjectListResult>({
    url: `${Api.ParentidListUrl}/${parentid}/children`,
  });
}

// 获取区列
export function getAddressInfo(id: any) {
  return request.get<ProjectListResult>({
    url: `${Api.ParentidListUrl}/${id}`,
  });
} 