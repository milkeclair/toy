import { styleText } from "node:util";

export default class Logger {
  static info(message, { color = "white", before = false, after = false } = {}) {
    Logger.#p("info", message, color, before, after);
  }

  static warn(message, { color = "yellow", before = false, after = false } = {}) {
    Logger.#p("warn", message, color, before, after);
  }

  static error(message, { color = "red", before = false, after = false } = {}) {
    Logger.#p("error", message, color, before, after);
  }

  constructor() {
    this.info = Logger.info;
    this.warn = Logger.warn;
    this.error = Logger.error;
  }

  // private

  static #p = (level, message, color, before, after) => {
    let text = styleText(color, `[${level}] ${message}`);
    if (before) text = `\n${text}`;
    if (after) text = `${text}\n`;
    console.log(text);
  };
}
