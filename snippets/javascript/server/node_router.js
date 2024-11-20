import NodeController from "./node_controller.js";

export default class NodeRouter {
  static allowedRoutes = {
    "/": "../compare_code.html",
    "/compare_code": "../compare_code.html",
    "/favicon.ico": "./favicon.ico",
    "/404": "./404.html.ejs",
  };

  static handle = (req, res) => {
    if (req.method !== "GET") {
      NodeController.Actions.badRequest(res);
    } else if (req.url === "/404" || !NodeRouter.allowedRoutes[req.url]) {
      NodeController.Actions.notFound(req, res);
    } else if (req.url === "/favicon.ico") {
      NodeController.Actions.appIcon(req, res);
    } else {
      NodeController.Actions.page(req, res);
    }
  };

  static isRoot = (req) => {
    return req.url === "/";
  };

  static isBadRequest = (req) => {
    return req.method !== "GET";
  };

  static isNotFound = (view) => {
    return view.includes("<title>404</title>");
  };
}
