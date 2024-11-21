import NodeController from "./node_controller.js";

export default class NodeRouter {
  static allowedRoutes = {
    "/": "../compare_code.html",
    "/compare_code": "../compare_code.html",
    "/favicon.ico": "./favicon.ico",
    "/404": "./404.html.ejs",
    "/dig_nested_keys.js": "../dig_nested_keys.js",
    "/flatten.js": "../flatten.js",
  };

  static handle = (req, res) => {
    if (NodeRouter.isBadRequest(req)) {
      NodeController.Action.badRequest(res);
    } else if (NodeRouter.isNotFound(req)) {
      NodeController.Action.notFound(req, res);
    } else if (NodeRouter.isAppIcon(req)) {
      NodeController.Action.appIcon(req, res);
    } else if (NodeRouter.isScript(req)) {
      NodeController.Action.script(req, res);
    } else {
      NodeController.Action.page(req, res);
    }
  };

  static isRoot = (req) => {
    return req.url === "/";
  };

  static isBadRequest = (req) => {
    return req.method !== "GET";
  };

  static isNotFound = (req) => {
    return !NodeRouter.allowedRoutes[req.url] || req.url === "/404";
  };

  static isAppIcon = (req) => {
    return req.url === "/favicon.ico";
  };

  static isScript = (req) => {
    return req.url.includes(".js");
  };
}
