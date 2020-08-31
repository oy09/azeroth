import { AxiosRequestConfig } from 'axios';

export interface ResponseData<T> {
  code?: string;
  data?: T;
  message?: string;
}

export interface RequestAction<T extends any> {
  data: ResponseData<T>;
  error?: Error;
  loading: boolean;
  execute: () => any;
  reload: () => void;
  cancel: (msg: string) => void;
}

export type RequestOptions = (Options & AxiosRequestConfig) | string;

export interface Options {
  loadMore?: boolean;
  pagination?: boolean;
}

/**
 * 手动/自动请求
 * 请求状态
 * 刷新请求
 * 取消请求
 * TODO 分页
 * TODO 加载更多
 * TODO 屏幕聚焦自动请求
 * @param service
 */
const useRequest = <T>(service: RequestOptions): RequestAction<T> => {
  return {
    data: {},
    loading: false,
    execute: () => undefined,
    reload: () => undefined,
    cancel: msg => undefined,
  };
};

export default useRequest;
