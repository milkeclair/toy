import fs from "node:fs";
import ejs from "ejs";
import NodeRouter from "./node_router.js";
import NodeServer from "./node_server.js";

export default class NodeRenderer {
  static mimeTypes = {
    html: "text/html",
    ejs: "text/html",
    css: "text/css",
    js: "text/javascript",
    png: "image/png",
    ico: "image/x-icon",
  };

  static render = (url, data = {}) => {
    return NodeRenderer.#renderView(NodeRouter.allowedRoutes[url], data);
  };

  static isNotFoundView = (view) => {
    return view.includes("<title>404</title>");
  };

  // private

  static #renderView = (path, data = {}) => {
    data = { ...data, appHome: NodeServer.appHome, message: data.message || "" };
    try {
      if (path.endsWith(".ejs")) {
        return ejs.render(fs.readFileSync(path, "utf-8"), data);
      } else {
        return fs.readFileSync(path, "utf-8");
      }
    } catch (error) {
      return ejs.render(fs.readFileSync(NodeRouter.allowedRoutes["/404"], "utf-8"), data);
    }
  };
}
