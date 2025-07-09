import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { CreateAxiosOptions } from './axiosTransform';
import { RequestOptions, Result } from './types';

export class VAxios {
  private axiosInstance: AxiosInstance;
  private readonly options: CreateAxiosOptions;

  constructor(options: CreateAxiosOptions) {
    this.options = options;
    this.axiosInstance = axios.create(options);
    this.setupInterceptors();
  }

  private getTransform() {
    const { transform } = this.options;
    return transform;
  }

  private setupInterceptors() {
    const transform = this.getTransform();
    if (!transform) return;

    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptors,
      responseInterceptorsCatch,
    } = transform;

    if (requestInterceptors) {
      this.axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => requestInterceptors(config));
    }
    if (requestInterceptorsCatch) {
      this.axiosInstance.interceptors.request.use(undefined, requestInterceptorsCatch);
    }
    if (responseInterceptors) {
      this.axiosInstance.interceptors.response.use(responseInterceptors);
    }
    if (responseInterceptorsCatch) {
      this.axiosInstance.interceptors.response.use(undefined, responseInterceptorsCatch);
    }
  }

  request<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    let conf: AxiosRequestConfig = { ...config };

    const transform = this.getTransform();

    const { requestOptions } = this.options;

    const opt: RequestOptions = Object.assign({}, requestOptions, options);

    const { beforeRequestHook, requestCatch, transformRequestData } = transform || {};

    // 根据 externalUrlStatus 动态设置 baseURL
    if (opt.externalUrlStatus !== undefined) {
      let baseURL = '';
      
      if (import.meta.env.PROD) {
        // 生产环境
        switch (opt.externalUrlStatus) {
          case 0:
            // 默认API地址
            baseURL = 'https://api-work.gatherbee.cn/api';
            break;
          case 1:
            // 外部API地址（日志相关）- 使用api-cloud-uat.gatherbee.cn
            baseURL = 'https://api-cloud-uat.gatherbee.cn/api';
            break;
          case 2:
            // CAD API地址
            baseURL = 'https://api-work.gatherbee.cn/api';
            break;
          default:
            baseURL = 'https://api-work.gatherbee.cn/api';
        }
      } else {
        // 开发环境
        switch (opt.externalUrlStatus) {
          case 0:
            // 默认API地址
            baseURL = opt.apiUrl || '/api';
            break;
          case 1:
            // 外部API地址（日志相关）
            baseURL = opt.externalUrlPrefix || '/log';
            break;
          case 2:
            // CAD API地址
            baseURL = opt.externalUrlPrefixCad || '/cad';
            break;
          default:
            baseURL = opt.apiUrl || '/api';
        }
      }
      
      conf.baseURL = baseURL;
    }

    if (beforeRequestHook && typeof beforeRequestHook === 'function') {
      conf = beforeRequestHook(conf);
    }

    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request<any, AxiosResponse<Result>>(conf)
        .then((res: AxiosResponse<Result>) => {
          if (transformRequestData && typeof transformRequestData === 'function') {
            try {
              const ret = transformRequestData(res, opt);
              resolve(ret);
            } catch (err) {
              reject(err || new Error('请求出错，请稍候重试'));
            }
            return;
          }
          resolve(res as unknown as Promise<T>);
        })
        .catch((e: Error) => {
          if (requestCatch && typeof requestCatch === 'function') {
            reject(requestCatch(e));
            return;
          }
          reject(e);
        });
    });
  }

  post<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'POST' }, options);
  }
} 