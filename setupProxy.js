// const { createProxyMiddleware } = require('http-proxy-middleware');

// // ...

// app.use('/api/khalti', createProxyMiddleware({
//   target: 'https://khalti.com',
//   changeOrigin: true,
//   pathRewrite: {
//     '^/api/khalti': '/api/v2/payment/verify/'
//   },
//   onProxyRes: (proxyRes, req, res) => {
//     proxyRes.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000';
//     proxyRes.headers['Access-Control-Allow-Methods'] = 'POST';
//     proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
//   }
// }));