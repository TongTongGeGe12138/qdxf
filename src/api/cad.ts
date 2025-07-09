// import type { ProjectListResult } from '@/api/model/detailModel';
import { requestCad } from '@/utils/request';

interface P2dResponse {
  Code: number;
  Msg: string;
  Log: any;
  Data: string;
}

//  获取p2d地址接口
export function getP2d(data: { DwgUrl: string }) {
  return requestCad.post<P2dResponse>(
    {
      url: '/Jd_Project/GetP2d',
      data,
    },
    { externalUrlStatus: 1 },
  );
}

// 获取最近打开列表
export function getDocumentsList(data: any) {
  return requestCad.post<any>(
    {
      url: '/Document/GetDocuments',
      data,
    },
    { externalUrlStatus: 2 },
  );
}

// 新建cad文件
export function addCad(data: any) {
  return requestCad.post<any>(
    {
      url: '/Document/Create',
      data,
    },
    { externalUrlStatus: 2 },
  );
} 