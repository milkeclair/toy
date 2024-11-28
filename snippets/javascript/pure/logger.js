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

  constructor() {
    this.info = Logger.info;
    this.warn = Logger.warn;
    this.error = Logger.error;
  }

  // private

  static #p = (level, message, color, before, after, timestamp) => {
    const time = new Date().toLocaleString("sv-SE");
    if (timestamp) message = `${time} - ${message}`;

    let text = styleText(color, `[${level}] ${message}`);
    if (before) text = `\n${text}`;
    if (after) text = `${text}\n`;

    console.log(text);
  };
}
