const express = require('express');
const client = require('prom-client');
const app = express();
const register = client.register;

const counter = new client.Counter({
  name: 'node_request_operations_total',
  help: 'Total number of requests'
});

app.get('/', (req, res) => {
  counter.inc(); // increment counter
  res.send('Hello from monitoring app!');
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(3000, () => {
  console.log('App running on http://localhost:3000');
});

