const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({
    service: "eks-real-app",
    status: "ok",
    path: req.url
  }));
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
