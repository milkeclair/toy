import { createServer } from "node:http";
import fs from "node:fs";
import ejs from "ejs";

const hostname = "localhost";
const port = 3000;
const rootPath = "..";
const mainPagePath = `${rootPath}/compare_code.html`;

const server = createServer((request, response) => {
  console.log(`Request from: url=${request.url}, method=${request.method}`);

  if (request.url === "/favicon.ico") {
    const view = renderView("./favicon.ico");
    response.statusCode = isNotFound(view) ? 404 : 200;
    response.setHeader("Content-Type", "image/x-icon");
    response.end(view);
  } else {
    const view =
      request.url === "/"
        ? renderView(mainPagePath)
        : renderView(`${rootPath}${request.url}.html`);

    response.statusCode = isNotFound(view) ? 404 : 200;
    response.setHeader("Content-Type", "text/html");
    response.end(view);
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  console.log("Press Ctrl+C to stop the server.");
});

process.on("SIGINT", () => {
  console.log("\nGoodbye!");
  process.exit();
});

const renderView = (path) => {
  try {
    return fs.readFileSync(path, "utf-8");
  } catch {
    return ejs.render(fs.readFileSync("./404.html.ejs", "utf-8"), {
      message: `${path} not found`,
    });
  }
};

const isNotFound = (view) => {
  return view.includes("<title>404</title>");
};
