node_setup_dependencies() {
  if [ ! -f package.json ]; then
    npm init es6 -y
  fi

  for file in *.js; do
    if grep -q "^import" "$file"; then
      imports=$(node_hp_extract_packages "$file")

      for pkg in $imports; do
        node_hp_install_package "$pkg"
      done
    fi
  done
}

# helper

node_hp_extract_packages() {
  local file=$1
  if [ -f "$file" ]; then
    imports=$(
      grep "^import" "$file" | # package: import hoge from "hoge:fuga"; relative: import hoge from "./hoge";
        awk '{print $NF}' |    # package: "hoge:fuga"; relative: "./hoge";
        awk -F: '{print $1}' | # package: "hoge"; relative: "./hoge";
        grep -v '\/' |         # package: "hoge"; relative: ""
        tr -d "'\";"           # package: hoge; relative: ""
    )
  fi

  echo "$imports"
}

node_hp_install_package() {
  local pkg=$1
  # !node_modules/$pkg || !npm search "$pkg"
  if [ ! -d "node_modules/$pkg" ] || ! npm search "$pkg" >/dev/null 2>&1; then
    echo -e "\n-- installing $pkg ---\n"
    npm install "$pkg"
  fi
}
