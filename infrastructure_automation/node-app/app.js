const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  fs.readFile('index.html', (err, html) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading index.html');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    }
  });
});

server.listen(3000, () => {
  console.log('Node app running on http://localhost:3000');
});

