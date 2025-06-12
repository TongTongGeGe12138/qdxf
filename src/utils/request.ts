import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';

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