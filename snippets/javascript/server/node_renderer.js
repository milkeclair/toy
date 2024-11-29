import fs from "node:fs";
import ejs from "ejs";

export default class NodeRenderer {
  mimeTypes = {
    plain: "text/plain",
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
    data = {
      ...data,
      appHome: this.server.config.appHome,
      message: data.message || "",
    };

    try {
      const content = this.#read(path);
      if (path.endsWith(".ejs")) return ejs.render(content, data);

      return content;
    } catch (error) {
      const content = this.#read(this.router.allowedRoutes["/404"]);
      return ejs.render(content, data);
    }
  };

  #read = (path) => {
    return fs.readFileSync(path, "utf-8");
  };
}
