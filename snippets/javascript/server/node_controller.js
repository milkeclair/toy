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
      console.log(`[warn] Not Found: ${req.url}, returning 404`);
      const view = NodeRenderer.renderNotFound(`${req.url} not found`);
      NodeController.#setStatusCode(res, view);
      NodeController.#setHeader(res, "html");
      res.end(view);
    },

    deliver: (req, res, mimeType) => {
      const content = NodeRenderer.render(req.url);
      NodeController.#setStatusCode(res, content);
      NodeController.#setHeader(res, mimeType);
      res.end(content);
    },

    appIcon: (req, res) => {
      NodeController.Action.deliver(req, res, "ico");
    },

    page: (req, res) => {
      NodeController.Action.deliver(req, res, "html");
    },

    script: (req, res) => {
      NodeController.Action.deliver(req, res, "js");
    },
  };

  // private

  static #setStatusCode = (res, view) => {
    res.statusCode = NodeRenderer.isNotFoundView(view) ? 404 : 200;
  };

  static #setHeader = (res, type) => {
    res.setHeader("Content-Type", NodeRenderer.mimeTypes[type]);
  };
}
