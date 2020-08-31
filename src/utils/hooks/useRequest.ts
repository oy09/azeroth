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

export interface Options {}

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
