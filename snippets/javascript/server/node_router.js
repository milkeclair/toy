import fs from "node:fs";
import path from "node:path";
import { camelize } from "../pure/camelize.js";

export default class NodeRouter {
  allowedRoutes = {};
  extensionPaths = {};
  registeredTime = null;

  activate = ({ config, server, controller, logger, warden }) => {
    Object.assign(this, { config, server, controller, logger, warden });
  };

  draw = ({ routes, extensions }) => {
    this.allowedRoutes = { ...this.allowedRoutes, ...routes };
    this.extensionPaths = { ...this.extensionPaths, ...extensions };
  };

  handle = async (req, res) => {
    await this.#handleFirstRequest();
    this.#registerRoutes(Object.keys(this.extensionPaths));

    const action = this.controller.action;
    if (this.warden.validate.illegal(req)) return action.badRequest(res);
    if (this.warden.validate.notFound(req)) return action.notFound(req, res);
    if (this.warden.validate.appIcon(req)) return action.appIcon(req, res);
    if (this.warden.validate.script(req)) return action.script(req, res);
    if (this.warden.validate.css(req)) return action.css(req, res);

    const actionName = this.#getAction(req);
    action[actionName](req, res);
  };

  // private

  #handleFirstRequest = async () => {
    if (this.registeredTime) return;
    await this.#registerRoutes(Object.keys(this.extensionPaths));
  };

  #registerRoutes = async (extensions) => {
    if (this.#isLatestRoutes()) return;

    this.registeredTime = Date.now();
    this.logger.info.updatingAllowedRoutes();
    for (const extension of extensions) {
      for (const basePath of this.extensionPaths[extension]) {
        this.allowedRoutes = await this.#updateAllowedRoutes(basePath, extension);
      }
    }
    this.logger.info.allowedRoutesUpdated();
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
      if (this.#isNotDirectory(error.message)) return [];
      this.logger.error.custom(error.message);
    }
  };

  #formatRoute = (path, extension) => {
    if (extension === ".html" || extension === ".ejs") {
      return `/${this.#processPath.removeExtension(path)}`;
    } else if (extension === ".css" || extension === ".scss") {
      return `/assets/css/${path}`;
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

  #isNotDirectory = (message) => {
    return message.includes("no such file or directory");
  };

  #isAsset = (url) => {
    return url.includes("/assets/");
  };
}
