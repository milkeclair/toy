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

    appIcon: (req, res) => {
      const icon = NodeRenderer.render(req.url);
      NodeController.#setStatusCode(res, icon);
      NodeController.#setHeader(res, "ico");
      res.end(icon);
    },

    page: (req, res) => {
      const view = NodeRenderer.render(req.url);
      NodeController.#setStatusCode(res, view);
      NodeController.#setHeader(res, "html");
      res.end(view);
    },

    script: (req, res) => {
      const script = NodeRenderer.render(req.url);
      NodeController.#setStatusCode(res, script);
      NodeController.#setHeader(res, "js");
      res.end(script);
    },
  };

  // private

  static #setStatusCode = (res, view) => {
    res.statusCode = NodeRenderer.isNotFoundView(view) ? 404 : 200;
  };

  static #setHeader = (res, type) => {
    res.setHeader("Content-Type", NodeRenderer.mineTypes[type]);
  };
}
