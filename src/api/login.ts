import request from '@/utils/request';

export const login = (params: any) => {
  return request.post('/api/authoirize/login', { params });
};

export const logout = (params: any) => {
  return request.put('/api/authoirize/logout', { params });
};
