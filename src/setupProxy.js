const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/riot',
    createProxyMiddleware({
      target: 'https://americas.api.riotgames.com',
      changeOrigin: true,
      pathRewrite: {
        '^/riot': ''
      },
      onProxyReq: (proxyReq, req) => {
        proxyReq.setHeader('X-Riot-Token', process.env.REACT_APP_LOL_API_KEY);
      }
    })
  );
  app.use(
    '/br1',
    createProxyMiddleware({
      target: 'https://br1.api.riotgames.com',
      changeOrigin: true,
      pathRewrite: {
        '^/br1': ''
      },
      onProxyReq: (proxyReq, req) => {
        proxyReq.setHeader('X-Riot-Token', process.env.REACT_APP_LOL_API_KEY);
      }
    })
  );
};
