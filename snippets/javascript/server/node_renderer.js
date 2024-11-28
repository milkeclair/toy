import fs from "node:fs";
import ejs from "ejs";

export default class NodeRenderer {
  mimeTypes = {
    html: "text/html",
    ejs: "text/html",
    css: "text/css",
    js: "text/javascript",
    png: "image/png",
    ico: "image/x-icon",
  };

  activate = ({ server, router }) => {
    this.server = server;
    this.router = router;
  };

  render = (url, data = {}) => {
    return this.#renderView(this.router.allowedRoutes[url], data);
  };

  isNotFoundView = (view) => {
    return view.includes("<title>404</title>");
  };

  // private

  #renderView = (path, data = {}) => {
    data = { ...data, appHome: this.server.appHome, message: data.message || "" };
    try {
      if (path.endsWith(".ejs")) {
        return ejs.render(fs.readFileSync(path, "utf-8"), data);
      } else {
        return fs.readFileSync(path, "utf-8");
      }
    } catch (error) {
      return ejs.render(fs.readFileSync(this.router.allowedRoutes["/404"], "utf-8"), data);
    }
  };
}
