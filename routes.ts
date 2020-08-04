import { IRoute } from 'umi';

const routes: IRoute[] = [
  {
    path: '/',
    component: '@/layouts',
    routes: [
      {
        path: '/',
        component: '@/pages/test1',
      },
    ],
  },
];

export default routes;
