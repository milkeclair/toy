import { digNestedKeys } from "./dig_nested_keys.js";
import { camelize } from "./camelize.js";

export default class PureJSUtil {
  static digNestedKeys = digNestedKeys;
  static camelize = camelize;
}

const obj = {
  a: {
    b: {
      c: "d",
    },
  },
};

console.log(PureJSUtil.digNestedKeys(["a", "b", "c"], obj)); // => "d"
