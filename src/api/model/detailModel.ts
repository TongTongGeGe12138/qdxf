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

// API 响应接口
export interface ApiResponse<T> {
  code: number;
  data: T;
  message?: string;
}

// 列表数据的通用接口
export interface ListData<T> {
    list: T[];
    total: number;
}

// 项目项接口
export interface ProjectItem {
  id: string;
  name: string;
  value: string;
  content?: string;
  contentShow?: boolean;
  description?: string;
  status: number;
  createTime: string;
  updateTime: string;
  extra?: {
    version?: string;
    url?: string;
    tip?: string;
    englishName?: string;
    group?: string;
    icon?: any;
  };
}

// 项目列表结果接口
export interface ProjectListResult {
  code: number;
  data: ProjectItem[];
  message?: string;
}

// AIGC 模块组件接口
export interface AigcModuleComponent {
  id?: string;
  title: string;
  content: string;
  status: number;
  description?: string;
}

// AIGC 模块接口
export interface AigcModule {
  id: string;
  name: string;
  content: string;
  components: AigcModuleComponent[];
}

export interface ProjectInfo {
  adminName: string;
  adminPhone: string;
  index: number;
  name: string;
  updateTime: Date;
}
