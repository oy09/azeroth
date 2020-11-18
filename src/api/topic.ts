import request from '@/utils/request';

export const getTopicList = (params: any) => {
  return request.get('/api/topic', { params });
};
