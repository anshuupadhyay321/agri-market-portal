const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();


// =========================
// API Proxy
// =========================

app.use(
  '/api-mandi',
  createProxyMiddleware({
    target: 'https://api.data.gov.in',
    changeOrigin: true,
    secure: false,

    pathRewrite: {
      '^/api-mandi': '',
    },
  })
);


// =========================
// Angular Build Path
// =========================

const distPath = path.join(
  __dirname,
  'dist/agri-market-portal/browser'
);

app.use(express.static(distPath));


// =========================
// Angular Routing Support
// =========================

app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});


// =========================
// Start Server
// =========================

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});