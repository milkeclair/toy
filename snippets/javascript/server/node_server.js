import { createServer as createNodeServer } from "node:http";
import NodeConfig from "./node_config.js";
import NodeRouter from "./node_router.js";
import NodeController from "./node_controller.js";
import NodeRenderer from "./node_renderer.js";
import NodeMiddleware from "./node_middleware.js";
import NodeLogger from "./node_logger.js";
import NodeWarden from "./node_warden.js";

export default class NodeServer {
  constructor() {
    this.config = new NodeConfig();
    this.router = new NodeRouter();
    this.controller = new NodeController();
    this.renderer = new NodeRenderer();
    this.middleware = new NodeMiddleware();
    this.logger = new NodeLogger();
    this.warden = new NodeWarden();

    this.#activates();
    this.server = this.#createServer();
  }

  activate = () => {
    this.server.listen(this.config.port, this.config.host, () => {
      this.logger.info.serverStarted(this.config.host, this.config.port);
      this.logger.info.howToStop();
    });

    this.#listenExit();
  };

  // private

  #activates = () => {
    const { config, router, controller, renderer, logger, warden } = this;
    const modules = { server: this, config, router, controller, renderer, logger, warden };

    this.config.activate(modules);
    this.router.activate(modules);
    this.controller.activate(modules);
    this.renderer.activate(modules);
    this.middleware.activate(modules);
    this.logger.activate(modules);
    this.warden.activate(modules);
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
