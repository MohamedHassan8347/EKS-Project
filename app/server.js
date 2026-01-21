const http = require("http");

const VERSION = "v3-gitops-test";

const server = http.createServer((req, res) => {
  if (req.url === "/version") {
    return res.end(JSON.stringify({
      service: "eks-real-app",
      version: VERSION,
      deployedAt: new Date().toISOString()
    }));
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({
    service: "eks-real-app",
    status: "ok",
    path: req.url
  }));
});

server.listen(3000, () => {
  console.log(`Server running on port 3000 (${VERSION})`);
});
