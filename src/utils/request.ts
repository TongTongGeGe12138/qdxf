import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: '/api', // 默认 API 前缀
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
    
    // 如果响应成功
    if (res.code === 200) {
      return res;
    }

    // 处理其他状态码
    ElMessage({
      message: res.message || '请求失败',
      type: 'error',
      duration: 5 * 1000
    });

    return Promise.reject(new Error(res.message || '请求失败'));
  },
  (error) => {
    console.error('Response error:', error);
    const message = error.response?.data?.message || error.message || '请求失败';
    
    ElMessage({
      message,
      type: 'error',
      duration: 5 * 1000
    });
    
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