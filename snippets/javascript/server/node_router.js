import fs from "node:fs";
import path from "node:path";
import { camelize } from "../pure/camelize.js";

export default class NodeRouter {
  allowedRoutes = {};
  extensionPaths = {};
  registeredTime = null;

  activate = ({ server, controller }) => {
    this.server = server;
    this.controller = controller;
    this.#setup();
  };

  handle = (req, res) => {
    this.#registerRoutes([".html", ".ejs", ".css", ".js"]);

    if (this.#isBadRequest(req)) {
      this.controller.action.badRequest(res);
    } else if (this.#isNotFound(req)) {
      this.controller.action.notFound(req, res);
    } else if (this.#isAppIcon(req)) {
      this.controller.action.appIcon(req, res);
    } else if (this.#isScript(req)) {
      this.controller.action.script(req, res);
    } else {
      const actionName = this.#getAction(req);
      this.controller.action[actionName](req, res);
    }
  };

  // private

  #setup = () => {
    const home = this.server.appHome;

    this.allowedRoutes = {
      "/": `${home}/view/compare_code.ejs`,
      "/favicon.ico": `${home}/assets/favicon.ico`,
      "/404": `${home}/view/404.ejs`,
    };

    this.extensionPaths = {
      ".html": [`${home}/view/`],
      ".ejs": [`${home}/view/`],
      ".css": [`${home}/assets/css/`],
      ".js": [`${home.replace(/\/server$/, "")}/pure/`],
    };
  };

  #registerRoutes = async (extensions) => {
    if (this.#isLatestRoutes()) {
      return;
    }

    this.registeredTime = Date.now();
    console.log("[info] Updating allowed routes...");
    for (const extension of extensions) {
      for (const basePath of this.extensionPaths[extension]) {
        this.allowedRoutes = await this.#updateAllowedRoutes(basePath, extension);
      }
    }
    console.log("[info] Allowed routes updated.");
  };

  #isLatestRoutes = () => {
    if (!this.registeredTime) {
      this.registeredTime = Date.now();
      return false;
    }

    const oneMinute = 60000;
    return this.registeredTime + oneMinute > Date.now();
  };

  #updateAllowedRoutes = async (basePath, extension) => {
    const files = await this.#extractTargetFiles(basePath, extension);
    return files.reduce((routes, file) => {
      const route = this.#formatRoute(file, extension);
      routes[route] = path.resolve(basePath, file);
      return routes;
    }, this.allowedRoutes);
  };

  #extractTargetFiles = async (basePath, extension) => {
    const fullPath = path.resolve(basePath);
    try {
      const files = await fs.promises.readdir(fullPath);
      return files.filter((file) => file.endsWith(extension));
    } catch (error) {
      if (error.message.includes("no such file or directory")) {
        return [];
      } else {
        console.log(`[error] ${error.message}`);
      }
    }
  };

  #formatRoute = (path, extension) => {
    if (extension === ".html" || extension === ".ejs") {
      return `/${this.#removeExtension(path)}`;
    } else {
      return `/${path}`;
    }
  };

  #removeExtension = (path) => {
    return path.split(".")[0];
  };

  #extractEndFromPath = (path) => {
    return path.split("/").pop();
  };

  #getAction = (req) => {
    const fullPath = this.allowedRoutes[req.url];
    const targetFilePath = this.#extractEndFromPath(fullPath);
    const camelized = camelize(targetFilePath);
    return this.#removeExtension(camelized);
  };

  #isBadRequest = (req) => {
    // ../ or ..\ or ..$
    const hasParentRegexp = new RegExp(/(\.\.(\/|\\|$))/);
    return req.method !== "GET" || req.url.match(hasParentRegexp);
  };

  #isNotFound = (req) => {
    return !this.allowedRoutes[req.url] || req.url === "/404";
  };

  #isAppIcon = (req) => {
    return req.url === "/favicon.ico";
  };

  #isScript = (req) => {
    return req.url.endsWith(".js");
  };
}
