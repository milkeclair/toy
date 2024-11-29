import Logger from "../pure/logger.js";

export default class NodeLogger {
  constructor() {
    this.logger = new Logger();
  }

  info = {
    custom: (message) => {
      this.logger.info(message);
    },

    serverStarted: (host, port) => {
      this.logger.info(`Server running at http://${host}:${port}`, { lineBreak: "before" });
    },

    howToStop: () => {
      this.logger.info("Press Ctrl+C to stop the server", { lineBreak: "after" });
    },

    receivedRequest: (request) => {
      const method = request.method.toUpperCase();
      const url = request.url;
      const ip = this.#extractIpAddress(request);
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

    notFound: (request) => {
      this.logger.warn(`Not Found: ${request.url}, returning 404`);
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
