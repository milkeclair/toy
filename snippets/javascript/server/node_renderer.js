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

  activate = ({ server, router, logger, util }) => {
    this.server = server;
    this.router = router;
    this.logger = logger;
    this.util = util;
  };

  render = ({ url, data = {}, loggable = false }) => {
    const path = this.router.allowedRoutes[url];
    const content = this.#renderView({ url, path, data, loggable });
    if (loggable) this.logger.info.rendered(url);
    return content;
  };

  isNotFoundView = (view) => {
    return view.includes("<title>404</title>");
  };

  // private

  #renderView = ({ url, path, data, loggable }) => {
    data = {
      ...data,
      appHome: this.server.config.appHome,
      message: data.message || "",
    };

    try {
      if (loggable) this.logger.info.rendering(url);
      const content = this.util.file.read(path);

      if (path.endsWith(".ejs")) return ejs.render(content, data);
      return content;
    } catch (error) {
      if (loggable) this.logger.error.cannotRender(url);

      const content = this.util.file.read(this.router.allowedRoutes["/404"]);
      return ejs.render(content, data);
    }
  };
}
