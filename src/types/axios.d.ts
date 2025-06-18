declare module './axios' {
  export class VAxios {
    constructor(options: any);
    request<T = any>(config: any, options?: any): Promise<T>;
  }
}

declare module './axiosTransform' {
  export interface CreateAxiosOptions {
    transform?: any;
    requestOptions?: any;
    authenticationScheme?: string;
  }
  export abstract class AxiosTransform {
    beforeRequestHook?: (config: any, options: any) => any;
    transformRequestData?: (res: any, options: any) => any;
    requestCatch?: (e: Error) => Promise<any>;
    requestInterceptors?: (config: any, options?: any) => any;
    responseInterceptors?: (res: any) => any;
    requestInterceptorsCatch?: (error: Error) => void;
    responseInterceptorsCatch?: (error: Error) => void;
  }
  export const transform: AxiosTransform;
}

declare module './httpEnum' {
  export enum ContentTypeEnum {
    Json = 'application/json;charset=UTF-8',
    FormURLEncoded = 'application/x-www-form-urlencoded;charset=UTF-8',
    FormData = 'multipart/form-data;charset=UTF-8',
  }
} 