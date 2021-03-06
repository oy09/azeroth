import { Random, mock } from 'mockjs';
import { Request, Response } from 'umi';
import './default';

export default {
  '/api/topic': (request: Request, response: Response) => {
    const { page = 1, pageSize = 20 } = request.query;
    const nextPage = parseInt(page as string);
    const nextPageSize = parseInt(pageSize as string);
    const offset = 500;
    console.log('params:', request.query);
    const data = new Array(nextPageSize).fill({ userId: 1000 }).map(item => {
      return {
        id: mock('@id(10)'),
        userId: item.userId + 1,
        content: mock('@cparagraph(4)'),
        contentType: 1,
        pictureList: [Random.image()],
        concatMobile: mock('@phone'),
        concatName: '欧阳',
        position: mock('@zip'),
        positionName: mock('@city'),
        publishTime: Random.date(),
        readCount: Random.integer(10, 2333),
        likeCount: Random.integer(10, 2333),
      };
    });

    response.send({
      code: 0,
      data: data,
      page: nextPage,
      pageSize: nextPageSize,
      total: offset,
      message: '成功',
    });
    response.end();
  },
  'POST /api/postTopic': {
    message: 'success',
    data: null,
  },
  'PUT /api/updateTopic': {
    message: 'success',
    data: null,
  },
  'DELETE /api/deleteTopic': {
    message: 'success',
    data: null,
  },
  '/api/getUser': {
    data: {
      id: 'az-2333',
      userId: 'wecat2333',
      // 用户接入类型, 微信、qq、其它
      registerType: '',
      cost: 50,
      collect: 7,
    },
    message: 'success',
  },
  'api/getCollect': {
    data: new Array(20)
      .fill({
        id: 1,
        userId: '2333',
        content: '2233',
        contentType: 1,
        pictureList: [],
        concatMobile: '13410825221',
        concatName: 'xiaoyao',
        position: '0,0,0',
        positionName: '深圳市',
        publishTime: '2020-04-01',
        readCount: 1234,
        likeCount: 2333,
      })
      .map(item => ({ ...item, id: item.id + 1 })),
    page: 1,
    limit: 20,
    total: 30,
    message: 'success',
  },
};
