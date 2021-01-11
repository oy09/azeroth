/**
 * 普通用户级Api
 */
import request from '@/utils/request';

export const getMenuList = () => {
  return request.get('api/menu/list');
};
