import fs from "node:fs";
import path from "node:path";
import NodeController from "./node_controller.js";

export default class NodeRouter {
  static allowedRoutes = {
    "/": "./view/compare_code.html",
    "/favicon.ico": "./view/favicon.ico",
    "/404": "./view/404.html.ejs",
  };

  static registeredTime = null;

  static extensionPaths = {
    ".html": ["./view/"],
    ".css": ["./assets/css/"],
    ".js": ["../pure/"],
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
    NodeRouter.registeredTime ??= Date.now();
    if (NodeRouter.#isLatestRoutes()) {
      return;
    }

    extensions.forEach((extension) => {
      NodeRouter.extensionPaths[extension].forEach((basePath) => {
        NodeRouter.allowedRoutes = NodeRouter.#updateAllowedRoutes(basePath, extension);
      });
    });
  };

  static #isLatestRoutes = () => {
    const oneMinute = 60000;
    return NodeRouter.registeredTime + oneMinute > Date.now();
  };

  static #updateAllowedRoutes = (basePath, extension) => {
    const files = NodeRouter.#extractTargetFiles(basePath, extension);
    return files.reduce((routes, file) => {
      const route = NodeRouter.#formatRoute(file, extension);
      routes[route] = path.resolve(basePath, file);
      return routes;
    }, NodeRouter.allowedRoutes);
  };

  static #extractTargetFiles = (basePath, extension) => {
    const fullPath = path.resolve(basePath);
    return fs.readdirSync(fullPath).filter((file) => file.endsWith(extension));
  };

  static #formatRoute = (path, extension) => {
    return extension === ".html" ? `/${NodeRouter.#removeExtension(path, extension)}` : `/${path}`;
  };

  static #removeExtension = (path, extension) => {
    return path.replace(extension, "");
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
