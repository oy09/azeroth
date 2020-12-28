import request from '@/utils/request';

export const getUser = (params: any) => {
  return request.get('/api/user/info', { params });
};

export const getMenu = (params: any) => {
  return request.get('/api/user/menu', { params });
};
