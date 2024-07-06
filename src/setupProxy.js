const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/riot',
    createProxyMiddleware({
      target: 'http://localhost:4000',
      changeOrigin: true,
      pathRewrite: {
        '^/riot': ''  // Remove '/riot' do início do caminho
      }
    })
  );
  app.use(
    '/br1',
    createProxyMiddleware({
      target: 'http://localhost:4000',
      changeOrigin: true,
      pathRewrite: {
        '^/br1': ''  // Remove '/br1' do início do caminho
      }
    })
  );
};
