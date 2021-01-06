import request from '@/utils/request';

/**
 * 普通api 用户信息查询
 */

export const getUser = (params: any) => {
  return request.get('/api/user/info', { params });
};

export const getMenu = (params: any) => {
  return request.get('/api/user/menu', { params });
};
