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

  static Actions = {
    badRequest: (res) => {
      console.log("[warn] Bad Request, returning 400");
      res.statusCode = 400;
      res.setHeader("Content-Type", "text/plain");
      res.end("400 Bad Request");
    },

    notFound: (req, res) => {
      console.log(`[warn] Not Found: ${req.url}, returning 404`);
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/html");
      res.end(NodeRenderer.renderNotFound(`${req.url} not found`));
    },

    appIcon: (req, res) => {
      const icon = NodeRenderer.render(req.url);
      res.statusCode = NodeRouter.isNotFound(icon) ? 404 : 200;
      res.setHeader("Content-Type", "image/x-icon");
      res.end(icon);
    },

    page: (req, res) => {
      const view = NodeRenderer.render(req.url);
      res.statusCode = NodeRouter.isNotFound(view) ? 404 : 200;
      res.setHeader("Content-Type", "text/html");
      res.end(view);
    },
  };

  // private

  static #listenExit = () => {
    process.on("SIGINT", () => {
      console.log("\nGoodbye!");
      process.exit();
    });
  };
}
