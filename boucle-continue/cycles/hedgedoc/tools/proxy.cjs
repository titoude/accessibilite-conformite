// Reverse proxy for the HedgeDoc dev audit: same-origin app where /api -> backend :3000, everything else -> frontend :3001.
const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({ ws: true });
proxy.on('error', (err, req, res) => {
  console.error('proxy error', req.url, err.message);
  if (res && res.writeHead) { res.writeHead(502); res.end('proxy error'); }
});

const server = http.createServer((req, res) => {
  const target = req.url.startsWith('/api') ? 'http://localhost:3000' : 'http://localhost:3001';
  proxy.web(req, res, { target });
});
server.on('upgrade', (req, socket, head) => {
  const target = req.url.startsWith('/api') || req.url.includes('realtime')
    ? 'ws://localhost:3000' : 'ws://localhost:3001';
  proxy.ws(req, socket, head, { target });
});
server.listen(3002, () => console.log('proxy on :3002'));
