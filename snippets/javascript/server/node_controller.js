export default class NodeController {
  activate = ({ server, renderer, logger }) => {
    this.server = server;
    this.renderer = renderer;
    this.logger = logger;
    this.action = this.#setupActions();
  };

  // private

  #setupActions = () => {
    return {
      // base

      badRequest: (res) => {
        this.logger.warn.badRequest();
        res.statusCode = 400;
        res.end("400 Bad Request", "plain");
      },

      notFound: (req, res) => {
        const view = this.renderer.render(req.url, { message: `${req.url} not found` });
        this.#setStatusCode(req, res, view);
        res.end(view, "html");
      },

      appIcon: (req, res) => {
        this.action.deliver(req, res, "ico");
      },

      script: (req, res) => {
        this.action.deliver(req, res, "js");
      },

      deliver: (req, res, mimeType, data = {}) => {
        const content = this.renderer.render(req.url, data);
        this.#setStatusCode(req, res, content);
        res.end(content, mimeType);
      },

      // html

      compareCode: (req, res) => {
        const data = { message: "Hello, world!" };
        this.action.deliver(req, res, "html", data);
      },
    };
  };

  #setStatusCode = (req, res, view) => {
    res.statusCode = this.renderer.isNotFoundView(view) ? 404 : 200;
    if (res.statusCode === 404) {
      this.logger.warn.notFound(req);
    }
  };
}
