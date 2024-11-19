import { createServer as createNodeServer } from "node:http";
import fs from "node:fs";
import ejs from "ejs";

export default class NodeServer {
  static #hostname = "localhost";
  static #port = 3000;
  static #rootPath = "..";
  static #mainPagePath = `${NodeServer.#rootPath}/compare_code.html`;

  static createServer = () => {
    return createNodeServer((request, response) => {
      console.log(
        `[info] Starting ${request.method.toUpperCase()}, url: ${request.url}`
      );

      if (this.#isAppIcon(request)) {
        this.#renderAppIcon(response);
      } else if (this.#isBadRequest(request)) {
        this.#returnBadRequest(response);
      } else {
        this.#renderPage(request, response);
      }
    });
  };

  static activate = (server) => {
    server.listen(NodeServer.#port, NodeServer.#hostname, () => {
      console.log(
        `[info] Server running at http://${NodeServer.#hostname}:${
          NodeServer.#port
        }/`
      );
      console.log("[info] Press Ctrl+C to stop the server.");
    });

    this.#listenExit();
  };

  // private

  static #renderPage = (req, res) => {
    const view = this.#isRoot(req)
      ? this.#renderView(NodeServer.#mainPagePath)
      : this.#renderView(`${NodeServer.#rootPath}${req.url}.html`);

    res.statusCode = this.#isNotFound(view) ? 404 : 200;
    if (req.statusCode === 404) {
      console.log("[warn] Not Found: ${req.url}");
    }
    res.setHeader("Content-Type", "text/html");
    res.end(view);
  };

  static #renderAppIcon = (res) => {
    const icon = this.#renderView("./favicon.ico");
    res.statusCode = this.#isNotFound(icon) ? 404 : 200;
    res.setHeader("Content-Type", "image/x-icon");
    res.end(icon);
  };

  static #returnBadRequest = (res) => {
    console.log("[warn] Bad Request, returning 400");
    res.statusCode = 400;
    res.setHeader("Content-Type", "text/plain");
    res.end("400 Bad Request");
  };

  static #renderView = (path) => {
    try {
      return fs.readFileSync(path, "utf-8");
    } catch {
      return this.#render404(`${path} not found`);
    }
  };

  static #render404 = (message) => {
    return ejs.render(fs.readFileSync("./404.html.ejs", "utf-8"), { message });
  };

  static #listenExit = () => {
    process.on("SIGINT", () => {
      console.log("\nGoodbye!");
      process.exit();
    });
  };

  static #isAppIcon = (req) => {
    return req.url === "/favicon.ico";
  };

  static #isBadRequest = (req) => {
    return req.url.includes(".") || req.method !== "GET";
  };

  static #isRoot = (req) => {
    return req.url === "/";
  };

  static #isNotFound = (view) => {
    return view.includes("<title>404</title>");
  };
}
