import request from '@/utils/request';

export interface LoginParamsType {
  username: string;
  password: string;
  code?: string;
}

export const login = (params: any) => {
  return request.post('/api/authoirize/login', { params });
};

export const logout = (params: any) => {
  return request.put('/api/authoirize/logout', { params });
};
