import {
  Method,
  CancelToken,
  AxiosResponse,
  AxiosTransformer,
  AxiosRequestConfig,
} from 'axios';

export type OnInterceptorsSuccess<T> = (value: T) => T | Promise<T>;
export type OnInterceptorsFailure<T> = (value: Error) => any;

// 请求选项
export interface RequestOptions {
  // 方法类型
  method?: Method;
  // 超市时间
  timeout?: number;
  // 请求头
  headers?: any;
  // 请求地址前缀
  baseURL?: string;
  // 请求地址
  url?: string;
  // true - 手动发起请求，默认false
  manualRequest?: boolean;
  // 默认参数
  defaultParmas?: any;
  // TODO 缓存/预加载
  cacheKey?: string;
  // TODO 屏幕聚焦重新请求
  windowsFocus?: boolean;
  // TODO 重新请求间隔
  focusTimespan?: number;
  withCredentials?: boolean;
  transformReqeust?: AxiosTransformer | AxiosTransformer[];
  transformResponse?: AxiosTransformer | AxiosTransformer[];
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
  // 取消请求
  cancelToken?: CancelToken;
  // 校验状态码
  validateStatus?: (status: number) => boolean;
  // 提交数据序列化
  dataSerializer?: (data: any) => string;
  // 请求错误回调
  onRequestError?: (e: Error) => void;
  [key: string]: any;
}
