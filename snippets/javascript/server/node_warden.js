export default class NodeWarden {
  activate = ({ router }) => {
    this.router = router;
  };

  validate = {
    illegal: (req) => {
      return req.method !== "GET" || this.#isDirectoryTraversal(req);
    },

    notFound: (req) => {
      return !this.router.allowedRoutes[req.url] || req.url === "/404";
    },

    appIcon: (req) => {
      return req.url === "/favicon.ico";
    },

    script: (req) => {
      return req.url.endsWith(".js");
    },

    css: (req) => {
      return req.url.endsWith(".css") || req.url.endsWith(".scss");
    },
  };

  // private

  #isDirectoryTraversal = (req) => {
    // ../ or ..\ or ..$
    const hasParentRegexp = new RegExp(/(\.\.(\/|\\|$))/);
    return req.url.match(hasParentRegexp);
  };
}
