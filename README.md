# Azeroth Project

## 开始

安装依赖
```bash
$ yarn or npm
```

启动服务
```bash
$ yarn start
```

## 本地开发配置
```
const isMock = true

export default defineConfig({
  define: {
    BASE_URL: '/',
    ENV: 'development',
  },
  devServer: {
    port: 10086,
    host: '0.0.0.0',
    https: {
      key: path.resolve(__dirname, 'public', 'localhost+2-key.pem'),
      cert: path.resolve(__dirname, 'public', 'localhost+2.pem')
    },
    compress: true,
  },
  mock: isMock ? {
    exclude: [
      'default',
      'utils',
    ]
  } : false,
  devtool: 'eval',
  dva: {
    hmr: true,
  },
  proxy: !isMock && {
    '/api/': {
      target: 'http://192.168.50.192',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    }
  }
})
```
注意本地是没有`umirc.local.ts`文件的，以上代码是基本配置，请根据需求自行变更

