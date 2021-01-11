import { AxiosResponse, AxiosRequestConfig } from 'axios';

export type OnInterceptorsSuccess<T> = (value: T) => T | Promise<T>;
export type OnInterceptorsFailure<T> = (value: Error) => any;

export type RequestUrlType = string | ((option: RequestOptions) => Promise<any> | void | undefined | null);

/**
 * 请求选项
 * 优化点
 * 1. 请求拦截改为单项配置，例如以下
 * requestFulfiled: Function, Function[]
 * requestRejected: Function, Function[]
 * responseFulfiled: Function, Function[]
 * responseFulfiled: Function, Function[]
 * 2. responseFulfiled项拦截器，做二次封装，方法传入AxiosResponse，但返回只返回数据（responseData），返回的数据由useRequest处理
 * responseFulfiled: (AxiosResponse) => ResponseData
 */

export type RequestType =
  | 'cancelToken'
  | 'params'
  | 'method'
  | 'timeout'
  | 'withCredentials'
  | 'validateStatus'
  | 'paramsSerializer'
  | 'transformRequest'
  | 'transformResponse'
  | 'baseURL';

export interface RequestOptions extends Pick<AxiosRequestConfig, RequestType> {
  url?: string;
  defaultData?: any;
  windowsFocus?: boolean;
  focusTimespan?: number;
  manualRequest?: boolean;
  formatResult?: (data?: any) => any;
  onRequestError?: (reason: Error) => void;
}
