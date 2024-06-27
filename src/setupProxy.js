
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '',
    createProxyMiddleware({
      target: 'https://americas.api.riotgames.com',
      changeOrigin: true,
      pathRewrite: {
        '^/riot': ''
      },
    })
  );
  app.use(
    '',
    createProxyMiddleware({
      target: 'https://br1.api.riotgames.com',
      changeOrigin: true,
      pathRewrite: {
        '^/br1': ''
      },
    })
  );
};









