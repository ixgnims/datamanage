const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  //部署生产环境和开发环境下的URL，
  publicPath: './',
  lintOnSave: false,
})

module.exports = {
  publicPath: '/',
  devServer: {
      historyApiFallback: true,
      allowedHosts: "all",
      proxy: {
          // 路由中匹配的路径
          '/devapi': {
              target:'http://127.0.0.1:8000', // 你请求的第三方接口
              changeOrigin:true, /* 在本地会创建一个虚拟服务端，然后发送请求的数据，
                                    并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题 */
              pathRewrite:{  // 路径重写，
                  /* 替换target中的请求地址，也就是说以后你在请求
                  http://127.0.0.1:8000/api这个地址的时候直接写成/api即可。 */
                  '^/api': ''
              }
          }
      }
  },
  chainWebpack: config => {
    // web worker配置
    config.module
        .rule('worker')
        .test(/\.worker\.js$/)
        .use('worker-loader')
        .loader('worker-loader')
        .options({
          inline: 'fallback',
          filename: 'workerName.[hash].worker.js'
        })
        .end();
    // 解决worker 热更新
    config.module.rule('js').exclude.add(/\.worker\.js$/);
  },
}