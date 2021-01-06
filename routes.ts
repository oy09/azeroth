import { AzRoute } from '@/typing';

const routes: AzRoute[] = [
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
        component: '@/pages/login',
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
        icon: 'dashboard',
        component: '@/pages/home',
      },
      {
        path: 'icon',
        title: '图标预览',
        name: 'icon',
        icon: 'share-alt',
        component: '@/pages/icon',
      },
      {
        path: 'topic',
        title: '内容管理',
        name: 'topic',
        icon: 'file',
        component: '@/pages/topic',
      },
      {
        path: 'menu',
        title: '菜单管理',
        name: 'menu',
        icon: 'hdd',
        component: '@/pages/menu',
      },
      {
        path: 'account',
        title: '用户管理',
        name: 'account',
        icon: 'user',
        component: '@/pages/user',
      },
      {
        path: 'role',
        title: '角色管理',
        name: 'role',
        icon: 'userSwitch',
        component: '@/pages/role',
      },
      {
        path: 'config',
        title: '配置管理',
        name: 'config',
        icon: 'setting',
        component: '@/pages/config',
      },
      // {
      //   path: 'menu2',
      //   title: '菜单',
      //   name: 'menu2',
      //   icon: 'branches',
      //   routes: [
      //     {
      //       path: 'menu1/test2/test3/test4',
      //       title: '菜单1',
      //       name: 'menu1',
      //       component: '@/pages/test1',
      //     },
      //     {
      //       path: 'menu2',
      //       title: '菜单2',
      //       name: 'menu2',
      //       component: '@/pages/test1',
      //     },
      //   ],
      // },
    ],
  },
  {
    path: '*',
    redirect: '/404',
  },
];

export default routes;
