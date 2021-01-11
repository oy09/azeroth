import { AxiosResponse, AxiosRequestConfig } from 'axios';

export type OnInterceptorsSuccess<T> = (value: T) => T | Promise<T>;
export type OnInterceptorsFailure<T> = (value: Error) => any;

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
export interface RequestOptions extends Omit<AxiosRequestConfig, 'adapter'> {
  /**
   * 请求拦截器
   */
  requestInterceptors?: [
    {
      onFulfiled?: OnInterceptorsSuccess<AxiosRequestConfig>;
      onRejected?: OnInterceptorsFailure<Error>;
    },
  ];
  // 响应拦截器
  responseInterceptors?: [
    {
      onFulfiled?: OnInterceptorsSuccess<AxiosResponse>;
      onRejected?: OnInterceptorsFailure<Error>;
    },
  ];
  // 提交数据序列化
  dataSerializer?: (data: any) => string;
  // 请求错误回调
  onRequestError?: (e: Error) => void;
  // 默认数据
  defaultData?: any;
  [key: string]: any;
}
