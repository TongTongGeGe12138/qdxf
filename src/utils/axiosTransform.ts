import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { RequestOptions, Result } from './types';

export interface CreateAxiosOptions extends AxiosRequestConfig {
  transform?: AxiosTransform;
  requestOptions?: RequestOptions;
  authenticationScheme?: string;
}

export abstract class AxiosTransform {
  /**
   * @description: 请求之前处理配置
   */
  beforeRequestHook?: (config: AxiosRequestConfig, options: RequestOptions) => AxiosRequestConfig;

  /**
   * @description: 请求成功处理
   */
  transformRequestData?: (res: AxiosResponse<Result>, options: RequestOptions) => any;

  /**
   * @description: 请求失败处理
   */
  requestCatch?: (e: Error) => Promise<any>;

  /**
   * @description: 请求之前的拦截器
   */
  requestInterceptors?: (config: InternalAxiosRequestConfig, options?: RequestOptions) => InternalAxiosRequestConfig;

  /**
   * @description: 请求之后的拦截器
   */
  responseInterceptors?: (res: AxiosResponse<any>) => AxiosResponse<any>;

  /**
   * @description: 请求之前的拦截器错误处理
   */
  requestInterceptorsCatch?: (error: Error) => void;

  /**
   * @description: 请求之后的拦截器错误处理
   */
  responseInterceptorsCatch?: (error: Error) => void;
}

export const transform: AxiosTransform = {
  beforeRequestHook: (config, options) => {
    return config;
  },

  requestInterceptors: (config, options) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = options?.authenticationScheme
        ? `${options.authenticationScheme} ${token}`
        : token;
    }
    return config;
  },

  responseInterceptors: (response: AxiosResponse<any>) => {
    return response;
  },

  transformRequestData: (res: AxiosResponse<Result>, options: RequestOptions) => {
    const { isTransformResponse, isReturnNativeResponse } = options;
    
    // 是否返回原生响应头
    if (isReturnNativeResponse) {
      return res;
    }
    
    // 不进行任何处理，直接返回
    if (!isTransformResponse) {
      return res.data;
    }
    
    const { data } = res;
    if (!data) {
      throw new Error('请求出错，请稍候重试');
    }
    
    return data;
  },

  requestCatch: (error: Error) => {
    return Promise.reject(error);
  }
}; 