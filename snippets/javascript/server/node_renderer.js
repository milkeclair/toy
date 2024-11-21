import fs from "node:fs";
import ejs from "ejs";
import NodeRouter from "./node_router.js";

export default class NodeRenderer {
  static mineTypes = {
    html: "text/html",
    css: "text/css",
    js: "text/javascript",
    png: "image/png",
    ico: "image/x-icon",
  };

  static render = (url) => {
    return NodeRenderer.#renderView(NodeRouter.allowedRoutes[url]);
  };

  static renderNotFound = (message) => {
    return ejs.render(
      fs.readFileSync(NodeRouter.allowedRoutes["/404"], "utf-8"),
      { message }
    );
  };

  static isNotFoundView = (view) => {
    return view.includes("<title>404</title>");
  };

  // private

  static #renderView = (path) => {
    try {
      return fs.readFileSync(path, "utf-8");
    } catch {
      return NodeRenderer.renderNotFound(`${path} not found`);
    }
  };
}
