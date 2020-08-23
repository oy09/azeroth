import { IRoute } from 'umi';

const routes: IRoute[] = [
  {
    path: '/user',
    component: '@/layouts/UserLayout',
    routes: [
      {
        path: '/user',
        redirect: '/user/login',
      },
      {
        path: 'login',
        title: '登录',
        name: 'login',
        component: '@/pages/test1',
      },
    ],
  },
  {
    path: '/404',
    component: '@/pages/404',
  },
  {
    path: '/',
    component: '@/layouts/AuthorizeLayout',
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
    path: '*',
    redirect: '/404',
  },
];

export default routes;
