// fake-services.mjs — services HTTP factices pour peupler le dashboard Gatus.
// Deux ports : 9101 (front-end factice) et 9102 (back-end factice).
// Routes :
//   GET  /health            -> 200 {"status":"UP"}
//   POST /items             -> 201 {"id":"it_42","price":"19.99"}
//   GET  /items/<id>        -> 200 {"id":<id>,"price":"19.99"}
import http from 'node:http';

function makeServer(port, name) {
  return http.createServer((req, res) => {
    const url = new URL(req.url, `http://127.0.0.1:${port}`);
    res.setHeader('Content-Type', 'application/json');
    if (req.method === 'GET' && url.pathname === '/health') {
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'UP', service: name }));
    } else if (req.method === 'POST' && url.pathname === '/items') {
      let body = '';
      req.on('data', c => (body += c));
      req.on('end', () => {
        let price = '19.99';
        try { price = JSON.parse(body).price ?? price; } catch { /* garder défaut */ }
        res.writeHead(201);
        res.end(JSON.stringify({ id: 'it_42', price }));
      });
    } else if (req.method === 'GET' && url.pathname.startsWith('/items/')) {
      res.writeHead(200);
      res.end(JSON.stringify({ id: url.pathname.slice(7), price: '19.99' }));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'not found' }));
    }
  }).listen(port, '127.0.0.1', () => console.log(`[fake:${name}] :${port} up`));
}

makeServer(9101, 'front-end');
makeServer(9102, 'back-end');
