import Logger from "../pure/logger.js";

export default class NodeController {
  activate = ({ server, renderer }) => {
    this.server = server;
    this.renderer = renderer;
    this.action = this.#setupActions();
  };

  // private

  #setupActions = () => {
    return {
      badRequest: (res) => {
        Logger.warn("Bad Request, returning 400");
        res.statusCode = 400;
        res.setHeader("Content-Type", "text/plain");
        res.end("400 Bad Request");
      },

      notFound: (req, res) => {
        const view = this.renderer.render(req.url, { message: `${req.url} not found` });
        this.#setStatusCode(req, res, view);
        this.#setHeader(res, "html");
        res.end(view);
      },

      deliver: (req, res, mimeType, data = {}) => {
        const content = this.renderer.render(req.url, data);
        this.#setStatusCode(req, res, content);
        this.#setHeader(res, mimeType);
        res.end(content);
      },

      appIcon: (req, res) => {
        this.action.deliver(req, res, "ico");
      },

      script: (req, res) => {
        this.action.deliver(req, res, "js");
      },

      compareCode: (req, res) => {
        const data = { message: "Hello, world!" };
        this.action.deliver(req, res, "html", data);
      },
    };
  };

  #setStatusCode = (req, res, view) => {
    res.statusCode = this.renderer.isNotFoundView(view) ? 404 : 200;
    if (res.statusCode === 404) {
      Logger.warn(`Not Found: ${req.url}, returning 404`);
    }
  };

  #setHeader = (res, type) => {
    res.setHeader("Content-Type", this.renderer.mimeTypes[type]);
  };
}
