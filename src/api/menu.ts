import request from '@/utils/request';

export const getMenuList = (params: any) => {
  return request.get('/admin-api/menu/getList', { params });
};

export const createMenu = (data: any) => {
  return request.post('/admin-api/menu/create', data);
};

export const updateMenu = (id: string, data: any) => {
  return request.put(`/admin-api/menu/update/${id}`, data);
};

export const deleteMenu = (data: any) => {
  return request.post('/admin-api/menu/delete', data);
};

export const enableItem = (data: any) => {
  return request.put('/admin-api/menu/enable', data);
};

export const disaableItem = (data: any) => {
  return request.put('/admin-api/menu/disable', data);
};
