export default class NodeMiddleware {
  #uses = [];

  activate = ({ config, renderer }) => {
    this.config = config;
    this.renderer = renderer;
  };

  overrideResponseEnd = ({ req, res }) => {
    const originalResponseEnd = res.end;
    res.end = (content, type) => {
      this.execute({ req, res, type });
      this.setHeader.type({ res, type });

      originalResponseEnd.apply(res, [content]);
    };
  };

  addAllowedOrigin = (origin) => {
    if (this.config.allowed.origins.includes(origin)) return;

    this.config.allowed.origins.push(origin);
  };

  use = (middleware) => {
    if (typeof middleware !== "function") {
      middleware = this.setHeader[middleware];
    }

    this.#uses.push(middleware);
  };

  unuse = (middleware) => {
    this.#uses = this.#uses.filter((use) => use !== middleware);
  };

  execute = ({ req, res, type }) => {
    const middlewares = [...this.#uses];
    this.#uses = [];
    middlewares.forEach((middleware) => middleware({ req, res, type }));
  };

  setHeader = {
    origin: ({ req, res }) => {
      const origin = req.headers.origin;
      const ip = this.#extractIpAddress(req);
      if (this.config.allowed.origins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
      } else if (this.config.allowed.ips.includes(ip)) {
        res.setHeader("Access-Control-Allow-Origin", "*");
      }
    },

    methods: ({ res }) => {
      res.setHeader("Access-Control-Allow-Methods", this.config.allowed.methods.join(","));
    },

    type: ({ res, type }) => {
      res.setHeader("Content-Type", this.renderer.mimeTypes[type]);
    },
  };

  #extractIpAddress = (req) => {
    return req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
  };
}
