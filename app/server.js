const http = require("http");
const fs = require("fs");
const path = require("path");
const client = require("prom-client");

// Prometheus metrics
client.collectDefaultMetrics();

const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "path", "status"],
});

const VERSION = process.env.VERSION || "local";
const GIT_SHA = process.env.GIT_SHA || "not-set";

// helper to increment metric safely
function inc(req, path, status) {
  httpRequestsTotal.inc({
    method: req.method || "GET",
    path,
    status: String(status),
  });
}

// serve static file from ./public
function serveStatic(req, res) {
  const reqPath = (req.url || "/").split("?")[0];

  // default to index.html
  const filePath =
    reqPath === "/" ? "/index.html" : reqPath;

  const safePath = path.normalize(filePath).replace(/^(\.\.(\/|\\|$))+/, "");
  const abs = path.join(__dirname, "public", safePath);

  // basic content types
  const ext = path.extname(abs).toLowerCase();
  const contentTypes = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
  };

  fs.readFile(abs, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      inc(req, reqPath, 404);
      return;
    }
    res.writeHead(200, { "Content-Type": contentTypes[ext] || "application/octet-stream" });
    res.end(data);
    inc(req, reqPath, 200);
  });
}

const server = http.createServer(async (req, res) => {
  const pathOnly = (req.url || "/").split("?")[0];

  if (pathOnly === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ service: "eks-real-app", status: "ok", path: pathOnly }));
    inc(req, pathOnly, 200);
    return;
  }

  if (pathOnly === "/version") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        service: "eks-real-app",
        version: VERSION,
        gitSha: GIT_SHA,
        deployedAt: new Date().toISOString(),
      })
    );
    inc(req, pathOnly, 200);
    return;
  }

  if (pathOnly === "/metrics") {
    try {
      res.writeHead(200, { "Content-Type": client.register.contentType });
      res.end(await client.register.metrics());
      inc(req, pathOnly, 200);
    } catch (e) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("metrics error");
      inc(req, pathOnly, 500);
    }
    return;
  }

  // serve UI/static
  serveStatic(req, res);
});

server.listen(3000, () => console.log("Server running on port 3000"));
