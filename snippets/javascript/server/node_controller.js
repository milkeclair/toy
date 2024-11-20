import { createServer as createNodeServer } from "node:http";
import NodeRenderer from "./node_renderer.js";

export default class NodeController {
  static #hostname = "localhost";
  static #port = 3000;
  static #mainPagePath = `/compare_code.html`;

  static createServer = () => {
    return createNodeServer((request, response) => {
      console.log(
        `[info] Starting ${request.method.toUpperCase()}, url: ${request.url}`
      );

      if (NodeController.#isAppIcon(request)) {
        NodeController.#renderAppIcon(response);
      } else if (NodeController.#isBadRequest(request)) {
        NodeController.#returnBadRequest(response);
      } else {
        NodeController.#renderPage(request, response);
      }
    });
  };

  static activate = (server) => {
    server.listen(NodeController.#port, NodeController.#hostname, () => {
      console.log(
        `[info] Server running at http://${NodeController.#hostname}:${
          NodeController.#port
        }/`
      );
      console.log("[info] Press Ctrl+C to stop the server.");
    });

    NodeController.#listenExit();
  };

  // private

  static #renderPage = (req, res) => {
    const view = NodeController.#isRoot(req)
      ? NodeRenderer.render(NodeController.#mainPagePath)
      : NodeRenderer.render(req.url);

    res.statusCode = NodeController.#isNotFound(view) ? 404 : 200;
    res.setHeader("Content-Type", "text/html");
    res.end(view);
  };

  static #renderAppIcon = (res) => {
    const icon = NodeRenderer.renderAppIcon();
    res.statusCode = NodeController.#isNotFound(icon) ? 404 : 200;
    res.setHeader("Content-Type", "image/x-icon");
    res.end(icon);
  };

  static #returnBadRequest = (res) => {
    console.log("[warn] Bad Request, returning 400");
    res.statusCode = 400;
    res.setHeader("Content-Type", "text/plain");
    res.end("400 Bad Request");
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
