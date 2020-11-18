/**
 * 网络接口基础模块
 * 成功条件1 status >= 200 && status < 300
 * 成功条件2 code === 0
 * 依赖qs query params序列化
 * 具有以下功能
 * 1. 基础接口交互
 * 2. 超时
 * 3. 请求拦截
 * 4. 请求响应
 * 5. 取消请求
 * 6. 取消上一个相同的请求
 * 7. 请求laoding UI 可配，默认false
 * 8. 业务请求失败提示 可配，默认false
 * 9. 基础的网络请求失败日式和提示，例如请求超时、网络异常、系统异常。可配, 默认true
 */

import axios, { AxiosRequestConfig, AxiosResponse, Canceler } from 'axios';
import qs from 'qs';
import { isNil, pick, omit } from 'lodash';
import { ResponseData } from '@/utils/hooks/useRequest';

export interface RequestConfig extends AxiosRequestConfig {
  // 取消重复的未响应请求
  autoCancelRepeatRequest?: boolean;
}

export type ResponseReason = Partial<AxiosResponse<ResponseData<any>>> & Error;

// 请求等待表
const waiting = new Map<string, Canceler>();
// 请求等待配置表
const waitingConfig = new Map<string, RequestConfig>();

/**
 * 创建请求唯一ID
 * @param config
 */
const createRequestId = (config: RequestConfig) => {
  return [config.method, config.url, qs.stringify(config.params), qs.stringify(config.data)].filter(item => item).join('&');
};

// 等待表添加请求记录
const addWaitRequest = (config: RequestConfig) => {
  if (!config.autoCancelRepeatRequest) {
    return;
  }
  const id = createRequestId(config);
  if (isNil(config.cancelToken)) {
    config.cancelToken = new axios.CancelToken(cancel => {
      if (waiting.has(id) === false) {
        const configProps = ['autoCancelRepeatRequest', 'method', 'url', 'params', 'data'];
        waiting.set(id, cancel);
        waitingConfig.set(id, pick(config, configProps));
      }
    });
  }
};

// 等待表移除请求记录
const removeWaitRequest = (config: RequestConfig) => {
  if (!config.autoCancelRepeatRequest) {
    return;
  }
  const id = createRequestId(config);
  if (waiting.has(id)) {
    const cancel = waiting.get(id);
    cancel && cancel(`请求-${config.url}-取消`);
    console.warn(`请求-${id}-取消`);
    waiting.delete(id);
    waitingConfig.delete(id);
  }
};

const removeRequest = (resposne: AxiosResponse) => {
  const id = createRequestId(resposne);
  if (waiting.has(id)) {
    waiting.delete(id);
    waitingConfig.delete(id);
  }
};

// 清除所有等待请求
export const clearWaitingRequest = () => {
  for (const [id] of waiting) {
    removeWaitRequest(waitingConfig.get(id) as RequestConfig);
  }
  waiting.clear();
  waitingConfig.clear();
};

const defaultConfig: RequestConfig = {
  timeout: 0,
  baseURL: BASE_URL,
  paramsSerializer: params => qs.stringify(params),
  validateStatus: status => status >= 200 && status < 300,
  withCredentials: true,
  autoCancelRepeatRequest: true,
};

const request = axios.create(defaultConfig);

const defaultRequestInterceptor = {
  onFulfilled: (config: RequestConfig) => {
    // 移除上次相同的请求
    removeWaitRequest(config);
    // 记录当前请求
    addWaitRequest(config);
    return config;
  },
  onRejected: (reason: any) => {},
};

const defaultResposneInterceptpr = {
  onFulfilled: (response: AxiosResponse<ResponseData<any>>) => {
    // 移除成功后的请求
    removeRequest(response);
    const responseData = response.data || {};
    const { code } = responseData;
    if (code === 0) {
      return responseData as any;
    } else {
      // TODO 这里可能有非常多的情况需要处理 登录失效，无权限，请求失败，...
      return Promise.reject(responseData);
    }
  },
  onRejected: (reason: ResponseReason) => {
    if (reason.data?.code) {
      // 处理登录失效，无权限，请求失败业务逻辑
    } else if (axios.isCancel(reason)) {
      // 处理取消请求业务逻辑
    } else if (navigator.onLine || /tiemout/.test(reason.message)) {
      // 处理请求超时业务逻辑
    } else {
      // 处理其它逻辑
    }
  },
};

request.interceptors.request.use(defaultRequestInterceptor.onFulfilled, defaultRequestInterceptor.onRejected);

request.interceptors.response.use(defaultResposneInterceptpr.onFulfilled, defaultResposneInterceptpr.onRejected);

export default request;
export const createRequest = (config: RequestConfig = {}) => {
  const request = axios.create({ ...defaultConfig, ...config });
  request.interceptors.request.use(defaultRequestInterceptor.onFulfilled, defaultRequestInterceptor.onRejected);

  request.interceptors.response.use(defaultResposneInterceptpr.onFulfilled, defaultResposneInterceptpr.onRejected);

  return request;
};

export const createSimpleRequest = (config: RequestConfig = {}) => {
  return axios.create({ ...defaultConfig, ...config });
};
