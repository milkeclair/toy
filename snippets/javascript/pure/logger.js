import { styleText } from "node:util";

export default class Logger {
  static info(message, { color = "white", before = false, after = false, timestamp = true } = {}) {
    Logger.#p("info", message, color, before, after, timestamp);
  }

  static warn(message, { color = "yellow", before = false, after = false, timestamp = true } = {}) {
    Logger.#p("warn", message, color, before, after, timestamp);
  }

  static error(message, { color = "red", before = false, after = false, timestamp = true } = {}) {
    Logger.#p("error", message, color, before, after, timestamp);
  }

  static returnable = {
    info: (message, { color = "white", before = false, after = false, timestamp = true } = {}) => {
      Logger.#p("info", message, color, before, after, timestamp, true);
    },

    warn: (message, { color = "yellow", before = false, after = false, timestamp = true } = {}) => {
      Logger.#p("warn", message, color, before, after, timestamp, true);
    },

    error: (message, { color = "red", before = false, after = false, timestamp = true } = {}) => {
      Logger.#p("error", message, color, before, after, timestamp, true);
    },
  };

  constructor() {
    this.info = Logger.info;
    this.warn = Logger.warn;
    this.error = Logger.error;
    this.returnable = Logger.returnable;
  }

  // private

  static #p = (level, message, color, before, after, timestamp, returnable = false) => {
    const time = new Date().toLocaleString("sv-SE");
    if (timestamp) message = `${time} - ${message}`;

    let text = styleText(color, `[${level}] ${message}`);
    if (before) text = `\n${text}`;
    if (after) text = `${text}\n`;

    if (returnable) return text;
    console.log(text);
  };
}
