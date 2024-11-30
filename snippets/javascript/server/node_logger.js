import Logger from "../pure/logger.js";

export default class NodeLogger {
  constructor() {
    this.logger = new Logger();
  }

  activate = ({ config }) => {
    this.config = config;
  };

  info = {
    custom: (message) => {
      this.logger.info(message);
    },

    serverStarted: () => {
      this.logger.info(`Server running at http://${this.config.host}:${this.config.port}`, {
        lineBreak: "before",
      });
    },

    howToStop: () => {
      this.logger.info("Press Ctrl+C to stop the server", { lineBreak: "after" });
    },

    receivedRequest: (req) => {
      const method = req.method.toUpperCase();
      const url = req.url;
      const ip = this.#extractIpAddress(req);
      this.logger.info(`Starting ${method}, url: ${url}, ip: ${ip}`);
    },

    exited: () => {
      this.logger.info("Gracefully stopping the server...", { lineBreak: "before" });
      this.logger.info("Goodbye!");
    },

    updatingAllowedRoutes: () => {
      this.logger.info("Updating allowed routes...");
    },

    allowedRoutesUpdated: () => {
      this.logger.info("Allowed routes updated.");
    },
  };

  warn = {
    custom: (message) => {
      this.logger.warn(message);
    },

    badRequest: () => {
      this.logger.warn(`Bad Request: returning 400`);
    },

    notFound: (req) => {
      this.logger.warn(`Not Found: ${req.url}, returning 404`);
    },
  };

  error = {
    custom: (message) => {
      this.logger.error(message);
    },
  };

  // private

  #extractIpAddress = (req) => {
    return req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
  };
}
