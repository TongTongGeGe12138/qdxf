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
// 用 Promise 保证只执行一次登出
let logoutPromise: Promise<void> | null = null;
// 标记是否已显示登出提示（防止多次提示）
let isShownLoginExpiredMessage = false;

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

// 重置登出处理标记 - 在登录成功时调用
export const resetLoginExpiredMessage = () => {
  logoutPromise = null;
  isShownLoginExpiredMessage = false;
};

// 处理登录过期的辅助函数
const handleLoginExpired = async () => {
  // 如果已经有登出 Promise 在进行，则直接等待并返回
  if (logoutPromise) {
    console.log('已有登出请求在进行，等待中...');
    await logoutPromise;
    return;
  }
  
  // 立即清除信息
  const userStore = useUserStore();
  userStore.clearUserInfo();
  
  // 只显示一次提示
  if (!isShownLoginExpiredMessage) {
    isShownLoginExpiredMessage = true;
    ElMessage.error('登录已过期，请重新登录');
    console.log('显示登出提示');
  }
  
  // 创建登出 Promise（用于其他异步请求共享）
  logoutPromise = new Promise<void>((resolve) => {
    setTimeout(() => {
      console.log('执行 location.replace');
      // 使用 location.replace 替换当前页面
      location.replace(location.origin + location.pathname + '#/login');
      resolve();
    }, 50);
  });
  
  // 等待登出完成
  await logoutPromise;
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
      case 401:
        // 如果已经在处理登出，直接返回
        if (logoutPromise) {
          return;
        }
        // 业务 401 - 登录过期
        handleLoginExpired();
        return;
      case 403:
        ElMessage.error('没有权限访问');
        break;
      case 404:
        ElMessage.error('请求的资源不存在');
        break;
      default:
        ElMessage.error(res.msg || '请求失败');
    }

    return Promise.reject(new Error(res.msg || '请求失败'));
  },
  async (error) => {
    console.error('Response error:', error);
    console.log('错误状态码:', error.response?.status, '错误URL:', error.config?.url);
    
    const originalRequest = error.config;
    
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.log('捕获401错误，当前路由:', router.currentRoute.value.path);
          
          // 如果已经在登录页，就不再处理
          if (router.currentRoute.value.path === '/login') {
            console.log('已在登录页，不处理');
            return Promise.reject(error);
          }

          if (originalRequest.url?.includes('/auth/token/refresh')) {
            console.log('token刷新失败，执行登出...');
            await handleLoginExpired();
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
            console.error('token刷新异常，执行登出...', refreshError);
            processQueue(refreshError, null);
            
            await handleLoginExpired();
            
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