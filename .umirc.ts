import { defineConfig } from 'umi';

import routes from './routes';

export default defineConfig({
  base: '/',
  publicPath: '/',
  hash: true,
  targets: {
    ie: 11,
  },
  antd: {},
  sass: {
    implementation: require('node-sass'),
  },
  favicon: '/favicon.png',
  title: false,
  ignoreMomentLocale: true,
  metas: [
    {
      name: 'keywords',
      content: 'react，后管，平台，学习',
    },
  ],
  plugins: [],
  headScripts: [],
  scripts: [],
  links: [],
  styles: [],
  analyze: {
    analyzerMode: 'server',
    analyzerPort: 9999,
    openAnalyzer: true,
    generateStatsFile: false,
    logLevel: 'info',
  },
  dva: {
    immer: false,
    hmr: false,
  },
  locale: {
    default: 'zh-CN',
    antd: true,
    baseSeparator: '-',
  },
  // umi routes: https://umijs.org/docs/routing
  routes: routes,
});
