import fs from "node:fs";

export default class NodeUtil {
  activate = ({ renderer }) => {
    this.renderer = renderer;
  };

  url = {
    hasExtension: (url) => {
      const ext = url.split(".").pop();
      return !!this.renderer.mimeTypes[ext];
    },

    removeExtension: (url) => {
      return url.split(".").shift();
    },

    extractEnd: (url) => {
      return url.split("/").pop();
    },
  };

  directory = {
    asyncRead: async (path) => {
      return fs.promises.readdir(path);
    },
  };

  file = {
    read: (path) => {
      return fs.readFileSync(path, "utf-8");
    },
  };

  request = {
    extractIpAddress: (req) => {
      return req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
    },
  };
}
