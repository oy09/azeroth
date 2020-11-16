import { AxiosResponse, AxiosRequestConfig } from 'axios';

export type OnInterceptorsSuccess<T> = (value: T) => T | Promise<T>;
export type OnInterceptorsFailure<T> = (value: Error) => any;

// 请求选项
export interface RequestOptions extends Omit<AxiosRequestConfig, 'adapter'> {
  // 请求拦截器
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
  [key: string]: any;
}
