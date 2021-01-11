import request from '@/utils/request';

/**
 * 授权登录接口
 */

export interface LoginParamsType {
  account: string;
  password: string;
  code?: string;
}

export const login = (params: any) => {
  return request.post('/api/authorize/login', params);
};

export const logout = (params: any) => {
  return request.put('/api/authorize/logout', params);
};
