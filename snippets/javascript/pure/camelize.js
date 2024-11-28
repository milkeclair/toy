export const camelize = (str, { lowerFirst = true } = {}) => {
  const kebabOrSnake = /[-_]/;
  const afterOneChar = /(.)/;
  const initials = new RegExp(`${kebabOrSnake.source}${afterOneChar.source}`, "g");

  if (!kebabOrSnake.test(str)) {
    return str;
  }

  const callback = (_all, char) => char.toUpperCase();
  if (lowerFirst) {
    return str.replace(initials, callback);
  } else {
    const firstChar = str[0];
    return str.replace(initials, callback).replace(afterOneChar, firstChar.toUpperCase());
  }
};
