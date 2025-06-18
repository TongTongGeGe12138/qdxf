/**
 * @description: 请求结果集
 */
export enum ResultEnum {
  SUCCESS = 200,
  ERROR = -1,
  TIMEOUT = 10042,
  TYPE = 'success',
}

/**
 * @description: 请求方法
 */
export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/**
 * @description: 内容类型
 */
export enum ContentTypeEnum {
  // json
  Json = 'application/json;charset=UTF-8',
  // form-data qs
  FormURLEncoded = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data upload
  FormData = 'multipart/form-data;charset=UTF-8',
} 