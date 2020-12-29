import { useContext, useState, useEffect, useCallback } from 'react';
import qs from 'qs';
import axios, { CancelTokenSource, AxiosInstance } from 'axios';
import { debounce } from 'lodash';
import RequestConfigContext from './requestConfigContext';
import { RequestOptions } from './type';
import windowsFocusSubscribe from './windowFocus';
import { ResponseData } from '@/typing';

export interface RequestAction<T> {
  dataSource?: ResponseData<T>;
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
  dataSerializer: data => qs.stringify(data),
  paramsSerializer: params => qs.stringify(params),
  requestInterceptors: [
    {
      onFulfiled: config => config,
      onRejected: e => e,
    },
  ],
  responseInterceptors: [
    {
      onFulfiled: response => response,
      onRejected: e => e,
    },
  ],
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
const useRequest = <T, P extends any>(url: string, options: RequestOptions = {}): RequestAction<T> => {
  const { onRequestError, windowsFocus = false, focusTimespan = 5000 } = options;
  const globalOptions = useContext(RequestConfigContext);
  const finalOptions = {
    ...deafultOptions,
    ...globalOptions,
    ...options,
  };
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<ResponseData<T>>();
  const [axiosToken, setAxiosToken] = useState<CancelTokenSource>();
  const [instance] = useState<AxiosInstance>(() => {
    const { requestInterceptors, responseInterceptors } = options;
    const httpInstance = axios.create(finalOptions);
    requestInterceptors?.forEach(item => httpInstance.interceptors.request.use(item.onFulfiled, item.onRejected));
    responseInterceptors?.forEach(item => httpInstance.interceptors.response.use(item.onFulfiled, item.onRejected));

    return httpInstance;
  });

  // 执行request
  const _execute = async (object: P) => {
    //组装axios的参数
    const getDataOptions = (data: P, options: RequestOptions) => {
      const { method, dataSerializer } = options;
      let config = {};
      const type = method?.toUpperCase();
      if (type === 'GET' || type === 'DELETE') {
        config = {
          params: dataSerializer ? dataSerializer(data) : data,
        };
      } else if (type === 'PUT' || type === 'POST') {
        config = {
          data: data,
        };
      }
      return config;
    };

    setLoading(true);
    const source = axios.CancelToken.source();
    setAxiosToken(source);
    try {
      const requestMethodOptions: RequestOptions = {
        url,
        cancelToken: source.token,
        ...options,
        ...getDataOptions(object, options),
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
    execute(options.defaultParmas);
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
      execute(options.defaultParmas);
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
