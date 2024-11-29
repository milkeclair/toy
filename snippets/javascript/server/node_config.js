export default class NodeConfig {
  host = "localhost";
  port = 3000;
  appHome = import.meta.dirname;

  activate = ({ router }) => {
    this.router = router;
  };

  draws = () => {
    const home = this.appHome;
    const homeParent = this.#processPath.parent(home);

    this.router.draw({
      routes: {
        "/": `${home}/view/compare_code.ejs`,
        "/favicon.ico": `${home}/assets/favicon.ico`,
        "/404": `${home}/view/404.ejs`,
      },
      extensions: {
        ".html": [`${home}/view/`],
        ".ejs": [`${home}/view/`],
        ".css": [`${home}/assets/css/`],
        ".js": [`${homeParent}/pure/`],
      },
    });
  };

  // private

  #processPath = {
    parent: (path) => {
      return path.replace(/\/server$/, "");
    },
  };
}
