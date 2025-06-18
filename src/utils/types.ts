export interface RequestOptions {
  // 接口地址
  apiUrl?: string;
  // 外部接口地址
  aigcApiBaseUrl?: string;
  // CAD接口地址
  cadApiBaseUrl?: string;
  // 是否自动添加接口前缀
  isJoinPrefix?: boolean;
  // 接口前缀
  urlPrefix?: string;
  // 外部接口前缀
  externalUrlPrefix?: string;
  // CAD接口前缀
  externalUrlPrefixCad?: string;
  // 是否返回原生响应头
  isReturnNativeResponse?: boolean;
  // 需要对返回数据进行处理
  isTransformResponse?: boolean;
  // post请求的时候添加参数到url
  joinParamsToUrl?: boolean;
  // 格式化提交参数时间
  formatDate?: boolean;
  // 是否加入时间戳
  joinTime?: boolean;
  // 是否忽略请求取消令牌
  ignoreCancelToken?: boolean;
  // 是否携带token
  withToken?: boolean;
  // 外部接口状态
  externalUrlStatus?: number;
  // 重试配置
  retry?: {
    count: number;
    delay: number;
  };
  // 认证方案
  authenticationScheme?: string;
}

export interface Result<T = any> {
  code: number;
  type: 'success' | 'error' | 'warning';
  message: string;
  data: T;
} 