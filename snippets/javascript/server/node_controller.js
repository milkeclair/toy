import { createServer as createNodeServer } from "node:http";
import NodeRenderer from "./node_renderer.js";
import NodeRouter from "./node_router.js";

export default class NodeController {
  static #hostname = "localhost";
  static #port = 3000;

  static createServer = () => {
    return createNodeServer((request, response) => {
      console.log(
        `[info] Starting ${request.method.toUpperCase()}, url: ${request.url}`
      );

      NodeRouter.handle(request, response);
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

  static Action = {
    badRequest: (res) => {
      console.log("[warn] Bad Request, returning 400");
      res.statusCode = 400;
      res.setHeader("Content-Type", "text/plain");
      res.end("400 Bad Request");
    },

    notFound: (req, res) => {
      console.log(`[warn] Not Found: ${req.url}, returning 404`);
      const view = NodeRenderer.renderNotFound(`${req.url} not found`);
      NodeController.#setStatusCode(res, view);
      NodeController.#setHeader(res, "html");
      res.end(view);
    },

    appIcon: (req, res) => {
      const icon = NodeRenderer.render(req.url);
      NodeController.#setStatusCode(res, icon);
      NodeController.#setHeader(res, "ico");
      res.end(icon);
    },

    page: (req, res) => {
      const view = NodeRenderer.render(req.url);
      NodeController.#setStatusCode(res, view);
      NodeController.#setHeader(res, "html");
      res.end(view);
    },

    script: (req, res) => {
      const script = NodeRenderer.render(req.url);
      NodeController.#setStatusCode(res, script);
      NodeController.#setHeader(res, "js");
      res.end(script);
    },
  };

  // private

  static #setStatusCode = (res, view) => {
    res.statusCode = NodeRenderer.isNotFoundView(view) ? 404 : 200;
  };

  static #setHeader = (res, type) => {
    res.setHeader("Content-Type", NodeRenderer.mineTypes[type]);
  };

  static #listenExit = () => {
    process.on("SIGINT", () => {
      console.log("\nGoodbye!");
      process.exit();
    });
  };
}
