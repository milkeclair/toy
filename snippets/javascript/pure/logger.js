import { styleText } from "node:util";

export default class Logger {
  static info(message, options = {}) {
    Logger.#p("info", message, { ...options });
  }

  static ok(message, options = {}) {
    Logger.#p("ok", message, { color: "green", ...options });
  }

  static debug(message, options = {}) {
    Logger.#p("debug", message, { color: "blue", ...options });
  }

  static warn(message, options = {}) {
    Logger.#p("warn", message, { color: "yellow", ...options });
  }

  static error(message, options = {}) {
    Logger.#p("error", message, { color: "red", ...options });
  }

  static returnable = {
    info: (message, options = {}) => Logger.info(message, { ...options, returnable: true }),
    ok: (message, options = {}) => Logger.ok(message, { ...options, returnable: true }),
    debug: (message, options = {}) => Logger.debug(message, { ...options, returnable: true }),
    warn: (message, options = {}) => Logger.warn(message, { ...options, returnable: true }),
    error: (message, options = {}) => Logger.error(message, { ...options, returnable: true }),
  };

  constructor() {
    this.info = Logger.info;
    this.ok = Logger.ok;
    this.debug = Logger.debug;
    this.warn = Logger.warn;
    this.error = Logger.error;
    this.returnable = Logger.returnable;
  }

  // private

  static #p(
    level,
    message,
    { color = "white", timestamp = true, lineBreak = "", returnable = false }
  ) {
    const time = new Date().toLocaleString("sv-SE");
    if (timestamp) message = `${time} - ${message}`;

    let text = styleText(color, `[${level}] ${message}`);
    if (lineBreak === "before") text = `\n${text}`;
    if (lineBreak === "after") text = `${text}\n`;
    if (lineBreak === "both") text = `\n${text}\n`;

    if (returnable) return text;
    console.log(text);
  }
}
