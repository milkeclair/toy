import fs from "node:fs";
import ejs from "ejs";
import NodeRouter from "./node_router.js";

export default class NodeRenderer {
  static render = (url) => {
    return NodeRenderer.#renderView(NodeRouter.allowedRoutes[url]);
  };

  static renderNotFound = (message) => {
    return ejs.render(
      fs.readFileSync(NodeRouter.allowedRoutes["/404"], "utf-8"),
      { message }
    );
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
