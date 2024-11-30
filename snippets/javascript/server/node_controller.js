export default class NodeController {
  activate = ({ server, renderer, logger }) => {
    Object.assign(this, { server, renderer, logger });
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
        const data = { message: `${req.url} not found` };
        const view = this.renderer.render({ url: "/404", data });
        this.#setStatusCode(req, res, view);
        res.end(view, "html");
      },

      appIcon: (req, res) => {
        this.action.deliver({ req, res, mimeType: "ico" });
      },

      script: (req, res) => {
        this.action.deliver({ req, res, mimeType: "js" });
      },

      css: (req, res) => {
        this.action.deliver({ req, res, mimeType: "css" });
      },

      deliver: ({ req, res, mimeType = "plain", data = {}, loggable = false }) => {
        const content = this.renderer.render({ url: req.url, data, loggable });
        this.#setStatusCode(req, res, content);
        res.end(content, mimeType);
      },

      // html

      compareCode: (req, res) => {
        const data = { message: "Hello, world!" };
        this.action.deliver({ req, res, mimeType: "html", data, loggable: true });
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
