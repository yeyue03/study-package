//需要采用CommonJS的写法
const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  //遇见 /api 前缀的请求,就会触发该代理配置
  app.use(
    createProxyMiddleware('/api', {
      target: 'http://10.14.22.252:2022', // 请求转发给谁（能返回数据的服务器地址）
      changeOrigin: true, // 控制服务器收到的响应头中Host字段的值
      pathRewrite: {
        '^/api': ''  // 重写请求路径，保证交给后台服务器是正常地请求地址（必须配置）
      }
    })
  )
}