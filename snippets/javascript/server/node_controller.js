import NodeRenderer from "./node_renderer.js";

export default class NodeController {
  static Action = {
    badRequest: (res) => {
      console.log("[warn] Bad Request, returning 400");
      res.statusCode = 400;
      res.setHeader("Content-Type", "text/plain");
      res.end("400 Bad Request");
    },

    notFound: (req, res) => {
      const view = NodeRenderer.render(req.url, { message: `${req.url} not found` });
      NodeController.#setStatusCode(req, res, view);
      NodeController.#setHeader(res, "html");
      res.end(view);
    },

    deliver: (req, res, mimeType, data = {}) => {
      const content = NodeRenderer.render(req.url, data);
      NodeController.#setStatusCode(req, res, content);
      NodeController.#setHeader(res, mimeType);
      res.end(content);
    },

    appIcon: (req, res) => {
      NodeController.Action.deliver(req, res, "ico");
    },

    script: (req, res) => {
      NodeController.Action.deliver(req, res, "js");
    },

    compareCode: (req, res) => {
      const data = { message: "Hello, world!" };
      NodeController.Action.deliver(req, res, "html", data);
    },
  };

  // private

  static #setStatusCode = (req, res, view) => {
    res.statusCode = NodeRenderer.isNotFoundView(view) ? 404 : 200;
    if (res.statusCode === 404) {
      console.log(`[warn] Not Found: ${req.url}, returning 404`);
    }
  };

  static #setHeader = (res, type) => {
    res.setHeader("Content-Type", NodeRenderer.mimeTypes[type]);
  };
}
