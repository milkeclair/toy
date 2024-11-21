import { createServer as createNodeServer } from "node:http";
import NodeRouter from "./node_router.js";

export default class NodeServer {
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
    server.listen(NodeServer.#port, NodeServer.#hostname, () => {
      console.log(
        `[info] Server running at http://${NodeServer.#hostname}:${
          NodeServer.#port
        }/`
      );
      console.log("[info] Press Ctrl+C to stop the server.");
    });

    NodeServer.#listenExit();
  };

  // private

  static #listenExit = () => {
    process.on("SIGINT", () => {
      console.log("\nGoodbye!");
      process.exit();
    });
  };
}
