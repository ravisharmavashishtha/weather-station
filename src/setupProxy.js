// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/info',
    createProxyMiddleware({
      target: 'http://esp32-weather.local/info',
      changeOrigin: true,
      pathRewrite: {
        '^/info': '', // Optionally, rewrite the path if needed
      },
    })
  );

  app.use(
    '/weather',
    createProxyMiddleware({
      target: 'http://pn.local:5000/weather',
      changeOrigin: true,
      pathRewrite: {
        '^/weather': '', // Optionally, rewrite the path if needed
      },
    })
  );


  app.use(
    '/tempdata',
    createProxyMiddleware({
      target: 'http://pn.local:5000/tempdata',
      changeOrigin: true,
      pathRewrite: {
        '^/tempdata': '', // Optionally, rewrite the path if needed
      },
    })
  );
};
