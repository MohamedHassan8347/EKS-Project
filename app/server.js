const http = require("http");
const client = require("prom-client");

client.collectDefaultMetrics();

const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "path", "status"],
});

const VERSION = process.env.VERSION || "local";
const GIT_SHA = process.env.GIT_SHA || "not-set";

const server = http.createServer(async (req, res) => {
  const path = req.url;

  if (path === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ service: "eks-real-app", status: "ok", path }));
    httpRequestsTotal.inc({ method: req.method, path, status: "200" });
    return;
  }

  if (path === "/version") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      service: "eks-real-app",
      version: VERSION,
      gitSha: GIT_SHA,
      deployedAt: new Date().toISOString(),
    }));
    httpRequestsTotal.inc({ method: req.method, path, status: "200" });
    return;
  }

  if (path === "/metrics") {
    try {
      res.writeHead(200, { "Content-Type": client.register.contentType });
      res.end(await client.register.metrics());
      httpRequestsTotal.inc({ method: req.method, path, status: "200" });
    } catch (e) {
      res.writeHead(500);
      res.end("metrics error");
      httpRequestsTotal.inc({ method: req.method, path, status: "500" });
    }
    return;
  }

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello from EKS GitOps 🚀");
  httpRequestsTotal.inc({ method: req.method, path, status: "200" });
});

server.listen(3000, () => console.log("Server running on port 3000"));

