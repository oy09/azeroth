/**
 * 普通用户级Api
 */
import request from '@/utils/request';

export const getMenuList = () => {
  return request.get('/api/base/getMenuList');
};

export const getMenuTree = () => {
  return request.get('/api/base/getMenuTree');
};

export const getRoleList = () => {
  return request.get('/api/base/getRoleList');
};
