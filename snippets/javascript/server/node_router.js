import fs from "node:fs";
import NodeController from "./node_controller.js";

export default class NodeRouter {
  static allowedRoutes = {
    "/": "../compare_code.html",
    "/favicon.ico": "./favicon.ico",
    "/404": "./404.html.ejs",
  };

  static handle = (req, res) => {
    NodeRouter.#registerRoutes([".html", ".css", ".js"]);

    if (NodeRouter.#isBadRequest(req)) {
      NodeController.Action.badRequest(res);
    } else if (NodeRouter.#isNotFound(req)) {
      NodeController.Action.notFound(req, res);
    } else if (NodeRouter.#isAppIcon(req)) {
      NodeController.Action.appIcon(req, res);
    } else if (NodeRouter.#isScript(req)) {
      NodeController.Action.script(req, res);
    } else {
      NodeController.Action.page(req, res);
    }
  };

  // private

  static #registerRoutes = (extensions) => {
    extensions.forEach((extension) => {
      const files = fs.readdirSync("../").filter((file) => file.includes(extension));
      NodeRouter.allowedRoutes = files.reduce((routes, file) => {
        const path = extension === ".html" ? `/${file.replace(extension, "")}` : `/${file}`;
        routes[path] = `../${file}`;
        return routes;
      }, NodeRouter.allowedRoutes);
    });
  };

  static #isBadRequest = (req) => {
    return req.method !== "GET";
  };

  static #isNotFound = (req) => {
    return !NodeRouter.allowedRoutes[req.url] || req.url === "/404";
  };

  static #isAppIcon = (req) => {
    return req.url === "/favicon.ico";
  };

  static #isScript = (req) => {
    return req.url.includes(".js");
  };
}
