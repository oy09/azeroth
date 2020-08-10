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
  favicon: './favicon.png',
  title: process.env.APP_TITLE,
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
  // umi routes: https://umijs.org/docs/routing
  routes: routes,
});
