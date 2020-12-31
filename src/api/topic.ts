import request from '@/utils/request';

export const getTopicList = (params: any) => {
  return request.get('/admin-api/topic/getList', { params });
};

export const createTopic = (data: any) => {
  return request.post('/admin-api/topic/createTopic', data);
};

export const updateTopic = (id: string, data: any) => {
  return request.put(`/admin-api/topic/updateTopic/${id}`, data);
};

export const deleteTopic = (params: any) => {
  return request.delete('/admin-api/topic/deleteList', { params });
};
