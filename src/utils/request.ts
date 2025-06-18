import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';
import { VAxios } from './axios';
import { CreateAxiosOptions } from './axiosTransform';
import { ContentTypeEnum } from './httpEnum';
import { merge } from 'lodash-es';
import { transform } from './axiosTransform';

// 环境变量
const host = import.meta.env.VITE_API_BASE_URL || '/api';
const externalhost = import.meta.env.VITE_EXTERNAL_API_BASE_URL;
const cadhost = import.meta.env.VITE_CAD_API_BASE_URL;

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // 从环境变量获取API前缀
  timeout: 50000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' }
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在这里可以添加token等认证信息
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;
    
    // 如果响应成功或者没有code字段（某些接口可能没有统一的返回格式）
    if (res.code === 200 || !res.hasOwnProperty('code')) {
      return res;
    }

    // 处理特定的错误码
    switch (res.code) {
      case 401:
        ElMessage.error('未授权，请重新登录');
        // 可以在这里处理登出逻辑
        break;
      case 403:
        ElMessage.error('没有权限访问');
        break;
      case 404:
        ElMessage.error('请求的资源不存在');
        break;
      default:
        ElMessage.error(res.message || '请求失败');
    }

    return Promise.reject(new Error(res.message || '请求失败'));
  },
  (error) => {
    console.error('Response error:', error);
    
    if (error.response) {
      switch (error.response.status) {
        case 401:
          ElMessage.error('未授权，请重新登录');
          break;
        case 403:
          ElMessage.error('没有权限访问');
          break;
        case 404:
          ElMessage.error('请求的资源不存在');
          break;
        case 500:
          ElMessage.error('服务器错误，请稍后重试');
          break;
        default:
          ElMessage.error(error.response.data?.message || '请求失败');
      }
    } else if (error.request) {
      ElMessage.error('网络错误，请检查您的网络连接');
    } else {
      ElMessage.error('请求配置错误');
    }
    
    return Promise.reject(error);
  }
);

// 请求方法封装
export const request = {
  get<T = any>(config: AxiosRequestConfig): Promise<T> {
    return service({ ...config, method: 'get' });
  },
  post<T = any>(config: AxiosRequestConfig): Promise<T> {
    return service({ ...config, method: 'post' });
  },
  put<T = any>(config: AxiosRequestConfig): Promise<T> {
    return service({ ...config, method: 'put' });
  },
  delete<T = any>(config: AxiosRequestConfig): Promise<T> {
    return service({ ...config, method: 'delete' });
  }
};

function createAxiosCad(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    merge(
      <CreateAxiosOptions>{
        authenticationScheme: 'Bearer',
        timeout: 10 * 1000,
        withCredentials: true,
        headers: {
          'Content-Type': ContentTypeEnum.Json,
        },
        transform,
        requestOptions: {
          apiUrl: host,
          aigcApiBaseUrl: externalhost,
          cadApiBaseUrl: cadhost,
          isJoinPrefix: true,
          urlPrefix: import.meta.env.VITE_API_URL_PREFIX,
          externalUrlPrefix: import.meta.env.VITE_API_URL_PREFIX_LOG,
          externalUrlPrefixCad: import.meta.env.VITE_API_URL_PREFIX_CAD,
          isReturnNativeResponse: false,
          isTransformResponse: false,
          joinParamsToUrl: false,
          formatDate: true,
          joinTime: true,
          ignoreCancelToken: true,
          withToken: true,
          externalUrlStatus: 0,
          retry: {
            count: 3,
            delay: 1000,
          },
        },
      },
      opt || {},
    ),
  );
}

export const requestCad = createAxiosCad(); 