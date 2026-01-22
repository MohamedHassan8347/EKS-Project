cat > app/server.js <<'EOF'
const http = require("http");
const fs = require("fs");
const path = require("path");
const client = require("prom-client");

/* =========================
   Prometheus metrics
========================= */
client.collectDefaultMetrics();

const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "path", "status"],
});

/* =========================
   App metadata
========================= */
const SERVICE = "eks-real-app";
const VERSION = process.env.VERSION || "local";
const GIT_SHA = process.env.GIT_SHA || "not-set";

/* =========================
   Helpers
========================= */
function respond(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}

function record(req, path, status) {
  httpRequestsTotal.inc({
    method: req.method,
    path,
    status: String(status),
  });
}

/* =========================
   Request handler
========================= */
const server = http.createServer(async (req, res) => {
  const reqPath = req.url;

  /* ---- UI homepage ---- */
  if (reqPath === "/" && req.method === "GET") {
    const html = `
<!doctype html>
<html>
  <head>
    <title>EKS GitOps App</title>
    <style>
      body { font-family: sans-serif; padding: 40px; }
      code { background: #eee; padding: 4px; }
    </style>
  </head>
  <body>
    <h1>🚀 EKS GitOps App</h1>
    <p>Service: <code>${SERVICE}</code></p>
    <p>Version: <code>${VERSION}</code></p>
    <p>Git SHA: <code>${GIT_SHA}</code></p>

    <ul>
      <li><a href="/health">/health</a></li>
      <li><a href="/version">/version</a></li>
      <li><a href="/metrics">/metrics</a></li>
    </ul>
  </body>
</html>
`;
    respond(res, 200, html, { "Content-Type": "text/html" });
    record(req, "/", 200);
    return;
  }

  /* ---- Health ---- */
  if (reqPath === "/health") {
    respond(
      res,
      200,
      JSON.stringify({ service: SERVICE, status: "ok", path: reqPath }),
      { "Content-Type": "application/json" }
    );
    record(req, reqPath, 200);
    return;
  }

  /* ---- Version ---- */
  if (reqPath === "/version") {
    respond(
      res,
      200,
      JSON.stringify({
        service: SERVICE,
        version: VERSION,
        gitSha: GIT_SHA,
        deployedAt: new Date().toISOString(),
      }),
      { "Content-Type": "application/json" }
    );
    record(req, reqPath, 200);
    return;
  }

  /* ---- Metrics ---- */
  if (reqPath === "/metrics") {
    try {
      const metrics = await client.register.metrics();
      respond(res, 200, metrics, {
        "Content-Type": client.register.contentType,
      });
      record(req, reqPath, 200);
    } catch (err) {
      respond(res, 500, "metrics error");
      record(req, reqPath, 500);
    }
    return;
  }

  /* ---- 404 ---- */
  respond(res, 404, "Not Found");
  record(req, reqPath, 404);
});

/* =========================
   Startup
========================= */
server.listen(3000, () => {
  console.log("Server running on port 3000");
});
EOF

