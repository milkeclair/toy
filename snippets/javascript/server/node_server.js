import { createServer as createNodeServer } from "node:http";
import NodeConfig from "./node_config.js";
import NodeRouter from "./node_router.js";
import NodeController from "./node_controller.js";
import NodeRenderer from "./node_renderer.js";
import NodeMiddleware from "./node_middleware.js";
import NodeLogger from "./node_logger.js";
import NodeWarden from "./node_warden.js";

export default class NodeServer {
  #moduleClasses = {
    server: NodeServer,
    config: NodeConfig,
    router: NodeRouter,
    controller: NodeController,
    renderer: NodeRenderer,
    middleware: NodeMiddleware,
    logger: NodeLogger,
    warden: NodeWarden,
  };

  constructor() {
    this.#initializes();
    this.#activates();
    this.config.setup();
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

  #initializes = () => {
    const modules = this.#rejectThis(this.#moduleClasses);
    Object.entries(modules).forEach(([name, module]) => {
      this[name] = new module();
    });
  };

  #activates = () => {
    Object.values(this.#modules({ rejectThis: true })).forEach((module) => {
      module.activate(this.#modules());
    });
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

  #rejectThis = (modules) => {
    const { server, ...rest } = modules;
    return rest;
  };

  #modules = ({ rejectThis = false } = {}) => {
    const modules = {
      server: this,
      config: this.config,
      router: this.router,
      controller: this.controller,
      renderer: this.renderer,
      middleware: this.middleware,
      logger: this.logger,
      warden: this.warden,
    };

    if (!rejectThis) return modules;
    return this.#rejectThis(modules);
  };
}
