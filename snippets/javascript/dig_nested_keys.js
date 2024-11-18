class DigNestedKeys {
  static digNestedKeys = (keys, obj) => {
    // accには第2引数のobjが入る
    // keyには第1引数のkeysの要素が順に入る
    return keys.reduce((acc, key) => {
      return acc[key] || null;
    }, obj);
  };
}
