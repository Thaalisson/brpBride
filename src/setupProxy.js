const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/riot',
    createProxyMiddleware({
      target: 'http://localhost:8888',
      changeOrigin: true,
      pathRewrite: {
        '^/riot': ''  // Remove '/riot' do início do caminho
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying request:', req.url);
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(500).send('Proxy error');
      }
    })
  );
  app.use(
    '/br1',
    createProxyMiddleware({
      target: 'http://localhost:8888',
      changeOrigin: true,
      pathRewrite: {
        '^/br1': ''  // Remove '/br1' do início do caminho
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying request:', req.url);
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(500).send('Proxy error');
      }
    })
  );
};
