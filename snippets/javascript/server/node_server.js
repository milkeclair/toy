import { createServer as createNodeServer } from "node:http";
import Logger from "../pure/logger.js";
import NodeRouter from "./node_router.js";
import NodeController from "./node_controller.js";
import NodeRenderer from "./node_renderer.js";

export default class NodeServer {
  #hostname = "localhost";
  #port = 3000;

  constructor() {
    this.appHome = import.meta.dirname;
    this.router = new NodeRouter();
    this.controller = new NodeController();
    this.renderer = new NodeRenderer();

    this.#activates();
    this.server = this.#createServer();
  }

  activate = () => {
    this.server.listen(this.#port, this.#hostname, () => {
      Logger.info(`Server running at http://${this.#hostname}:${this.#port}/`, {
        before: true,
      });
      Logger.info(`Press Ctrl+C to stop the server.`, { after: true });
    });

    this.#listenExit();
  };

  // private

  #activates = () => {
    this.router.activate({ server: this, controller: this.controller });
    this.controller.activate({ server: this, renderer: this.renderer });
    this.renderer.activate({ server: this, router: this.router });
  };

  #createServer = () => {
    return createNodeServer((request, response) => {
      Logger.info(`Starting ${request.method.toUpperCase()}, url: ${request.url}`);

      this.router.handle(request, response);
    });
  };

  #listenExit = () => {
    process.on("SIGINT", () => {
      console.log("\nGoodbye!");
      process.exit();
    });
  };
}
