const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });

  // Dedicated endpoint for CI/CD verification
  if (req.url === "/version") {
    return res.end(JSON.stringify({
      service: "eks-real-app",
      version: "v2-ci-test",
      gitSha: process.env.GIT_SHA || "not-set",
      deployedAt: new Date().toISOString()
    }));
  }

  // Default response
  res.end(JSON.stringify({
    service: "eks-real-app",
    status: "ok",
    path: req.url
  }));
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});

