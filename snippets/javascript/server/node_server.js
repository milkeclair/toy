import { createServer } from "node:http";
import fs from "node:fs";

const hostname = "localhost";
const port = 3000;
const html = fs.readFileSync("../compare_code.html");

const server = createServer((request, response) => {
  console.log(`Request from: url=${request.url}, method=${request.method}`);
  response.statusCode = 200;
  response.setHeader("Content-Type", "text/html");
  response.end(html);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  console.log("Press Ctrl+C to stop the server.");
});

process.on("SIGINT", () => {
  console.log("Goodbye!");
  process.exit();
});
