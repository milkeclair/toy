export default class NodeConfig {
  activate = ({ router }) => {
    this.router = router;
  };

  setup = () => {
    this.host = "localhost";
    this.port = 3000;
    this.appHome = import.meta.dirname;
    this.allowed = {
      origins: ["http://localhost:3000"],
      ips: ["::1", "127.0.0.1"],
      methods: ["GET", "POST", "PUT", "DELETE"],
    };

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
        ".scss": [`${home}/assets/css/`],
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
