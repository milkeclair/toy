import fs from "node:fs";
import path from "node:path";
import { camelize } from "../pure/camelize.js";
import Logger from "../pure/logger.js";

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

    const action = this.controller.action;
    if (this.#assert.badRequest(req)) return action.badRequest(res);
    if (this.#assert.notFound(req)) return action.notFound(req, res);
    if (this.#assert.appIcon(req)) return action.appIcon(req, res);
    if (this.#assert.script(req)) return action.script(req, res);

    const actionName = this.#getAction(req);
    action[actionName](req, res);
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
      ".js": [`${this.#processPath.parent(home)}/pure/`],
    };
  };

  #registerRoutes = async (extensions) => {
    if (this.#isLatestRoutes()) {
      return;
    }

    this.registeredTime = Date.now();
    Logger.info("Updating allowed routes...");
    for (const extension of extensions) {
      for (const basePath of this.extensionPaths[extension]) {
        this.allowedRoutes = await this.#updateAllowedRoutes(basePath, extension);
      }
    }
    Logger.info("Allowed routes updated.");
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
      const files = await this.#processPath.read(fullPath);
      return files.filter((file) => file.endsWith(extension));
    } catch (error) {
      if (error.message.includes("no such file or directory")) {
        return [];
      } else {
        Logger.error(error.message);
      }
    }
  };

  #formatRoute = (path, extension) => {
    if (extension === ".html" || extension === ".ejs") {
      return `/${this.#processPath.removeExtension(path)}`;
    } else {
      return `/${path}`;
    }
  };

  #getAction = (req) => {
    const fullPath = this.allowedRoutes[req.url];
    const targetFilePath = this.#processPath.extractEndFrom(fullPath);
    const camelized = camelize(targetFilePath);
    return this.#processPath.removeExtension(camelized);
  };

  #processPath = {
    parent: (path) => {
      return path.replace(/\/server$/, "");
    },

    read: async (path) => {
      return fs.promises.readdir(path);
    },

    removeExtension: (path) => {
      return path.split(".")[0];
    },

    extractEndFrom: (path) => {
      return path.split("/").pop();
    },
  };

  #assert = {
    badRequest: (req) => {
      // ../ or ..\ or ..$
      const hasParentRegexp = new RegExp(/(\.\.(\/|\\|$))/);
      return req.method !== "GET" || req.url.match(hasParentRegexp);
    },

    notFound: (req) => {
      return !this.allowedRoutes[req.url] || req.url === "/404";
    },

    appIcon: (req) => {
      return req.url === "/favicon.ico";
    },

    script: (req) => {
      return req.url.endsWith(".js");
    },
  };
}
