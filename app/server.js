const http = require('http');
const client = require('prom-client');

const VERSION = "v5-metrics-enabled";

// Collect default node/process metrics
client.collectDefaultMetrics();

// Custom counter
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'path', 'status']
});

const server = http.createServer(async (req, res) => {
  // health
  if (req.url === '/health') {
    res.writeHead(200);
    res.end('ok');
    httpRequestsTotal.inc({ method: req.method, path: '/health', status: '200' });
    return;
  }

  // version
  if (req.url === '/version') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      service: "eks-real-app",
      version: VERSION,
      deployedAt: new Date().toISOString()
    }));
    httpRequestsTotal.inc({ method: req.method, path: '/version', status: '200' });
    return;
  }

  // prometheus metrics (THIS must be text format, not JSON)
  if (req.url === '/metrics') {
    try {
      res.statusCode = 200;
      res.setHeader('Content-Type', client.register.contentType);
      res.end(await client.register.metrics());
      httpRequestsTotal.inc({ method: req.method, path: '/metrics', status: '200' });
    } catch (e) {
      res.statusCode = 500;
      res.end('metrics error');
      httpRequestsTotal.inc({ method: req.method, path: '/metrics', status: '500' });
    }
    return;
  }

  res.writeHead(200);
  res.end('Hello from EKS GitOps 🚀');
  httpRequestsTotal.inc({ method: req.method, path: req.url || '/', status: '200' });
});

server.listen(3000, () => {
  console.log(`Server running on port 3000 (${VERSION})`);
});
