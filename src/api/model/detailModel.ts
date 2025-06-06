export interface PurchaseListResult {
  list: Array<PurchaseInfo>;
}
export interface PurchaseInfo {
  adminName: string;
  index: string;
  pdName: string;
  pdNum: string;
  pdType: string;
  purchaseNum: number;
  updateTime: Date;
}

// API 响应的通用接口
export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
}

// 列表数据的通用接口
export interface ListData<T> {
    list: T[];
    total: number;
}

// 项目项接口
export interface ProjectItem {
    id: number;
    name: string;
    value: string;
    path?: string;
    description?: string;
    children?: ProjectItem[];
    content?: string;
    contentShow?: boolean;
    extra?: {
        group?: string;
        version?: string;
        url?: string;
        tip?: string;
        englishName?: string;
    };
}

// 项目列表响应类型
export type ProjectListResult = ApiResponse<ListData<ProjectItem>>;

export interface ProjectInfo {
  adminName: string;
  adminPhone: string;
  index: number;
  name: string;
  updateTime: Date;
}
