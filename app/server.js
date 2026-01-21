const http = require('http');

const VERSION = "v4-gitops-final";

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200);
    return res.end('ok');
  }

  if (req.url === '/version') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      service: "eks-real-app",
      version: VERSION,
      deployedAt: new Date().toISOString()
    }));
  }

  res.writeHead(200);
  res.end('Hello from EKS GitOps 🚀');
});

server.listen(3000, () => {
  console.log(`Server running on port 3000 (${VERSION})`);
});
