/**
 * 系统级Api
 */

import request from '@/utils/request';

/**
 * 菜单管理
 */

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

export const enableMenu = (data: any) => {
  return request.put('/admin-api/menu/enable', data);
};

export const disaableMenu = (data: any) => {
  return request.put('/admin-api/menu/disable', data);
};

/**
 * 话题管理
 */

export const getTopicList = (params: any) => {
  return request.get('/admin-api/topic/getList', { params });
};

export const createTopic = (data: any) => {
  return request.post('/admin-api/topic/createTopic', data);
};

export const updateTopic = (id: string, data: any) => {
  return request.put(`/admin-api/topic/updateTopic/${id}`, data);
};

export const deleteTopic = (data: any) => {
  return request.post('/admin-api/topic/deleteList', data);
};

/**
 * 用户管理
 */

export const getUserList = (params: any) => {
  return request.get('/admin-api/user/getList', { params });
};

export const createUser = (data: any) => {
  return request.post('/admin-api/user/create', data);
};

export const updateUser = (data: any) => {
  return request.put(`/admin-api/user/update/${data.id}`, data);
};

export const deleteUser = (data: any) => {
  return request.put('/admin-api/user/delete', data);
};

export const enableUser = (data: any) => {
  //
};

export const disableUser = (data: any) => {
  //
};

/**
 * 角色管理
 */

export const getRoleList = (params: any) => {
  return request.get('/admin-api/role/getList', { params });
};

export const createRole = (data: any) => {
  return request.post('/admin-api/role/create', data);
};

export const updateRole = (id: string, data: any) => {
  return request.put(`/admin-api/role/update/${id}`, data);
};

export const deleteRole = (data: any) => {
  return request.put('/admin-api/role/delete', data);
};

/**
 * 菜单树管理
 */

export const getMenuTreeList = (params?: any) => {
  return request.get('/admin-api/menu-tree/getList');
};

export const createMenuTree = (data: any) => {
  return request.post('/admin-api/menu-tree/create', data);
};

export const updateMenuTree = (data: any) => {
  return request.put('/admin-api/menu-tree/update', data);
};

export const deleteMenuTree = (data: any) => {
  return request.put('/admin-api/menu-tree/delete', data);
};
