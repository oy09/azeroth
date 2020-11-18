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
    const data = mock({
      code: 0,
      [`data|${pageSize}`]: [
        {
          id: Random.id(),
          userId: Random.guid(),
          content: mock('@cparagraph(20, 200)'),
          contentType: 1,
          'pictureList|1-4': [Random.image()],
          concatMobile: mock('@phone'),
          concatName: mock('@cname'),
          position: mock('@zip'),
          positionName: mock('@city'),
          publishTime: Random.date(),
          readCount: Random.integer(10, 2333),
          likeCount: Random.integer(10, 2333),
        },
      ],
      page: nextPage,
      pageSize: nextPageSize,
      total: offset,
      message: '成功',
    });
    response.send(data);
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
