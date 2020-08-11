import { IRoute } from 'umi';

const routes: IRoute[] = [
  {
    path: '/',
    component: '@/layouts',
    roles: ['admin', 'guest'],
    routes: [
      {
        path: '/',
        redirect: '/home',
      },
      {
        path: 'home',
        title: '首页',
        name: 'home',
        icon: 'smile',
        component: '@/pages/test1',
      },
      {
        path: 'icon',
        title: '图标',
        name: 'icon',
        icon: 'icon',
        component: '@/pages/test1',
      },
    ],
  },
  {
    path: '/user',
    component: '@/layouts',
    routes: [
      {
        path: 'login',
        title: '登录',
        name: 'login',
        component: '@/pages/test1',
      },
    ],
  },
];

export default routes;
