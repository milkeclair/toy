import { createServer as createNodeServer } from "node:http";
import NodeRouter from "./node_router.js";
import NodeController from "./node_controller.js";
import NodeRenderer from "./node_renderer.js";
import NodeMiddleware from "./node_middleware.js";
import NodeLogger from "./node_logger.js";

export default class NodeServer {
  #hostname = "localhost";
  #port = 3000;

  constructor() {
    this.appHome = import.meta.dirname;
    this.router = new NodeRouter();
    this.controller = new NodeController();
    this.renderer = new NodeRenderer();
    this.middleware = new NodeMiddleware();
    this.logger = new NodeLogger();

    this.#activates();
    this.server = this.#createServer();
  }

  activate = () => {
    this.server.listen(this.#port, this.#hostname, () => {
      this.logger.info.serverStarted(this.#hostname, this.#port);
      this.logger.info.howToStop();
    });

    this.#listenExit();
  };

  // private

  #activates = () => {
    this.router.activate({ server: this, controller: this.controller, logger: this.logger });
    this.controller.activate({ server: this, renderer: this.renderer, logger: this.logger });
    this.renderer.activate({ server: this, router: this.router });
    this.middleware.activate({ renderer: this.renderer });
  };

  #createServer = () => {
    return createNodeServer((request, response) => {
      this.#setupMiddlewares({ req: request, res: response });

      if (!this.#hasExtension(request.url)) {
        this.logger.info.receivedRequest(request);
      }

      this.router.handle(request, response);
    });
  };

  #listenExit = () => {
    process.on("SIGINT", () => {
      this.logger.info.exited();
      process.exit();
    });
  };

  #hasExtension = (url) => {
    const ext = url.split(".").pop();
    return !!this.renderer.mimeTypes[ext];
  };

  #setupMiddlewares = ({ req, res }) => {
    this.middleware.use("origin");
    this.middleware.use("methods");
    this.middleware.overrideResponseEnd({ req, res });
  };
}
