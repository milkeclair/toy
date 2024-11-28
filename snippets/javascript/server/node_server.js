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
      Logger.info(this.#message.startedServer(), {
        lineBreak: "before",
      });
      Logger.info(this.#message.howToStop(), { lineBreak: "after" });
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
      if (!this.#hasExtension(request.url)) {
        Logger.info(this.#message.receivedRequest(request));
      }

      this.router.handle(request, response);
    });
  };

  #listenExit = () => {
    process.on("SIGINT", () => {
      console.log(this.#message.exited());
      process.exit();
    });
  };

  #hasExtension = (url) => {
    const ext = url.split(".").pop();
    return !!this.renderer.mimeTypes[ext];
  };

  #message = {
    startedServer: () => {
      return `Server running at http://${this.#hostname}:${this.#port}/`;
    },

    howToStop: () => {
      return `Press Ctrl+C to stop the server.`;
    },

    exited: () => {
      return "\nGoodbye!";
    },

    receivedRequest: (request) => {
      return `Starting ${request.method.toUpperCase()}, url: ${
        request.url
      }, ip: ${this.#extractIpAddress(request)}`;
    },
  };

  #extractIpAddress = (req) => {
    return req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
  };
}
