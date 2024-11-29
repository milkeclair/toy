import { digNestedKeys } from "./dig_nested_keys.js";
import { camelize } from "./camelize.js";
import { hasAnyKey } from "./has_any_key.js";

export default class PureJSUtil {
  static digNestedKeys = digNestedKeys;
  static camelize = camelize;
  static hasAnyKey = hasAnyKey;

  static obj = {
    a: {
      b: {
        c: "d",
      },
    },
  };
}

console.log(PureJSUtil.digNestedKeys(["a", "b", "c"], PureJSUtil.obj)); // => "d"
console.log(PureJSUtil.camelize("hello_world", { lowerFirst: false })); // => "HelloWorld"
console.log(PureJSUtil.hasAnyKey(PureJSUtil.obj)); // => true
