/**
 * 普通用户级Api
 */
import request from '@/utils/request';

export const getMenuList = () => {
  return request.get('/api/base/getMenuList');
};

export const getRoleList = () => {
  return request.get('/api/base/getRoleList');
};
