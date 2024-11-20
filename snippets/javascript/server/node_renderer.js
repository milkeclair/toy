import fs from "node:fs";
import ejs from "ejs";

export default class NodeRenderer {
  static #rootPath = "..";

  static render = (path) => {
    return NodeRenderer.#renderView(`${NodeRenderer.#rootPath}${path}.html`);
  };

  static renderAppIcon = () => {
    return NodeRenderer.#renderView("./favicon.ico");
  };

  // private

  static #renderView = (path) => {
    try {
      return fs.readFileSync(path, "utf-8");
    } catch {
      console.log(`[warn] Not Found: ${path}`);
      return NodeRenderer.#render404(`${path} not found`);
    }
  };

  static #render404 = (message) => {
    return ejs.render(fs.readFileSync("./404.html.ejs", "utf-8"), { message });
  };
}
