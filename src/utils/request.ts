import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';
import { VAxios } from './axios';
import { CreateAxiosOptions } from './axiosTransform';
import { ContentTypeEnum } from './httpEnum';
import { merge } from 'lodash-es';
import { transform } from './axiosTransform';
import { UserRefresh } from '@/api/userCenter';
import { useUserStore } from '@/stores/user';
import router from '@/router';

// 环境变量
const host = import.meta.env.VITE_API_BASE_URL || '/api';
const externalhost = import.meta.env.VITE_EXTERNAL_API_BASE_URL;
const cadhost = import.meta.env.VITE_CAD_API_BASE_URL;

// 标记是否正在刷新token
let isRefreshing = false;
// 存储等待中的请求
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];
// 标记是否已显示登录过期提示
let isShowingLoginExpiredMessage = false;

// 处理等待中的请求
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// 重置登录过期标志 - 在登录成功时调用
export const resetLoginExpiredFlag = () => {
  isShowingLoginExpiredMessage = false;
};

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.PROD 
    ? 'https://api-work.beesfpd.com/api'  // 生产环境使用完整API地址
    : (import.meta.env.VITE_API_BASE_URL || '/api'), // 开发环境使用代理
  timeout: 50000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' }
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 定义不需要 token 的接口白名单
    const whiteList = ['/signup', '/auth/signin', '/auth/token/refresh']; 

    // 在这里可以添加token等认证信息
    const userStore = useUserStore();
    const token = userStore.accessToken || localStorage.getItem('token');
    
    // 检查当前请求是否在白名单中
    if (token && config.headers && !whiteList.includes(config.url || '')) {
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
      case 403:
        ElMessage.error('没有权限访问');
        break;
      case 404:
        ElMessage.error('请求的资源不存在');
        break;
      default:
        if (res.code !== 401) {
          ElMessage.error(res.msg || '请求失败');
        }
    }

    return Promise.reject(new Error(res.msg || '请求失败'));
  },
  async (error) => {
    console.error('Response error:', error);
    
    const originalRequest = error.config;
    
    if (error.response) {
      switch (error.response.status) {
        case 401:
          if (originalRequest.url?.includes('/auth/token/refresh')) {
            if (!isShowingLoginExpiredMessage) {
              isShowingLoginExpiredMessage = true;
              const userStore = useUserStore();
              userStore.clearUserInfo();
              ElMessage.error('请重新登录');
                router.push('/login');
            }
            return Promise.reject(error);
          }
          
          // 如果正在刷新token，将请求加入队列
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            }).then(token => {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              return service(originalRequest);
            }).catch(err => {
              return Promise.reject(err);
            });
          }
          
          originalRequest._retry = true;
          isRefreshing = true;
          
          try {
            const userStore = useUserStore();
            const refreshToken = userStore.refreshToken;
            
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }
            
            const res = await UserRefresh({ refreshToken });
            
            if (res.code === 200 && res.data?.accessToken) {
              // 更新token
              userStore.setUserInfo({
                accessToken: res.data.accessToken,
                refreshToken: res.data.refreshToken || refreshToken
              });
              
              // 更新当前请求的token
              originalRequest.headers['Authorization'] = `Bearer ${res.data.accessToken}`;
              
              // 处理等待中的请求
              processQueue(null, res.data.accessToken);
              
              // 重试当前请求
              return service(originalRequest);
            } else {
              throw new Error('Token refresh failed');
            }
          } catch (refreshError) {
            console.error('Token refresh error:', refreshError);
            processQueue(refreshError, null);
            
            if (!isShowingLoginExpiredMessage) {
              isShowingLoginExpiredMessage = true;
              const userStore = useUserStore();
              userStore.clearUserInfo();
              
              // 显示一次错误提示
              ElMessage.error('请重新登录');
              
              // 设置延迟后再跳转，确保不会有多个错误提示
              setTimeout(() => {
                router.push('/login');
              }, 300);
            }
            
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
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