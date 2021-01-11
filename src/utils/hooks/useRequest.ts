import { useContext, useState, useEffect, useCallback } from 'react';
import qs from 'qs';
import axios, { CancelTokenSource, AxiosInstance } from 'axios';
import { debounce } from 'lodash';
import RequestConfigContext from './requestConfigContext';
import { RequestOptions, RequestUrlType } from './type';
import windowsFocusSubscribe from './windowFocus';
import { ResponseData } from '@/typing';

export interface RequestAction<T> {
  dataSource: T;
  loading: boolean;
  execute: (...args: any[]) => Promise<any>;
  reload: () => Promise<any>;
  cancel: (msg?: string) => any;
}

const deafultOptions: RequestOptions = {
  method: 'GET',
  timeout: 0,
  manualRequest: false,
  withCredentials: true,
  validateStatus: status => status >= 200 && status < 300,
  paramsSerializer: params => qs.stringify(params),
};

/**
 * 手动/自动请求
 * 请求状态
 * 刷新请求
 * 取消请求
 * TODO 分页
 * TODO 加载更多
 * 屏幕聚焦自动请求
 * @param service
 */
const useRequest = <T = any, P = any>(url: RequestUrlType, options: RequestOptions = {}): RequestAction<T> => {
  const { onRequestError, windowsFocus = false, focusTimespan = 5000, formatResult } = options;
  const globalOptions = useContext(RequestConfigContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<ResponseData<T>>(options.defaultData);
  const [axiosToken, setAxiosToken] = useState<CancelTokenSource>();
  const [instance] = useState<Pick<AxiosInstance, 'request'>>(() => {
    if (typeof url === 'string') {
      return axios.create();
    } else {
      return {
        request: async (options: RequestOptions) => {
          const data = await url(options);
          return {
            data: formatResult ? formatResult(data) : data,
          };
        },
      } as any;
    }
  });

  // 执行request
  const _execute = async (object: P) => {
    setLoading(true);
    const source = axios.CancelToken.source();
    setAxiosToken(source);
    try {
      const requestMethodOptions: RequestOptions = {
        ...deafultOptions,
        ...globalOptions,
        url: url as string,
        cancelToken: source.token,
        ...options,
      };
      const { data } = await instance.request(requestMethodOptions);
      setData(data);
    } catch (e) {
      if (onRequestError === undefined) {
        throw new Error(e);
      } else {
        onRequestError(e);
      }
    } finally {
      setLoading(false);
    }
  };

  // 重新请求
  const _reload = async () => {
    cancel();
    execute(options.params);
  };

  // 取消
  const _cancel = (msg: string = `请求:${url}取消`) => {
    if (axiosToken) {
      axiosToken.cancel(msg);
    }
  };

  const execute = useCallback(_execute, [url]);

  const reload = useCallback(_reload, []);

  const cancel = useCallback(_cancel, [axiosToken]);

  // 初始化请求
  useEffect(() => {
    const { manualRequest } = options;
    if (!manualRequest) {
      execute(options.params);
    }

    return () => {
      cancel();
    };
  }, []);

  // 屏幕聚焦发起请求
  useEffect(() => {
    const unsubscribeList: any[] = [];
    if (windowsFocus) {
      const limitFn = debounce(reload, focusTimespan);
      unsubscribeList.push(windowsFocusSubscribe(limitFn));
    }

    return () => {
      unsubscribeList.forEach(fn => fn());
    };
  }, []);

  return {
    dataSource: data,
    loading: loading,
    execute: execute,
    reload: reload,
    cancel: cancel,
  };
};

const UseRequestProvider = RequestConfigContext.Provider;

export default useRequest;
export { UseRequestProvider };
