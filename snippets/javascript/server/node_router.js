import fs from "node:fs";
import path from "node:path";
import NodeServer from "./node_server.js";
import NodeController from "./node_controller.js";

export default class NodeRouter {
  static allowedRoutes = {};
  static extensionPaths = {};
  static registeredTime = null;

  static handle = (req, res) => {
    NodeRouter.#setup();
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

  static #setup = () => {
    if (
      Object.keys(NodeRouter.allowedRoutes).length > 0 &&
      Object.keys(NodeRouter.extensionPaths).length > 0
    ) {
      return;
    }
    const home = NodeServer.appHome;

    NodeRouter.allowedRoutes = {
      "/": `${home}/view/compare_code.html`,
      "/favicon.ico": `${home}/assets/favicon.ico`,
      "/404": `${home}/view/404.html.ejs`,
    };

    NodeRouter.extensionPaths = {
      ".html": [`${home}/view/`],
      ".css": [`${home}/assets/css/`],
      ".js": [`${home.replace(/\/server$/, "")}/pure/`],
    };
  };

  static #registerRoutes = (extensions) => {
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
    if (!NodeRouter.registeredTime) {
      NodeRouter.registeredTime = Date.now();
      return false;
    }

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
    try {
      return fs.readdirSync(fullPath).filter((file) => file.endsWith(extension));
    } catch (error) {
      if (error.message.includes("no such file or directory")) {
        return [];
      } else {
        console.log(`[error] ${error.message}`);
      }
    }
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
