node_setup_dependencies() {
  local dirs=("$@")

  if [ ! -f package.json ]; then
    echo -e "\n-- creating package.json ---\n"
    npm init es6 -y

    echo -e "\n-- installing nodemon ---\n"
    node_hp_install_nodemon
  fi

  node_hp_install_packages "${dirs[@]}"
}

# helper

node_hp_install_nodemon() {
  local start_command="nodemon -e js,ejs,html,css,scss --ignore 'node_modules/' ./server/app.js"
  npm install nodemon
  jq '.scripts.start = $start_command' --arg start_command "$start_command" package.json >tmp && mv tmp package.json
}

node_hp_install_packages() {
  local dirs=("$@")

  for dir in "${dirs[@]}"; do
    for file in "$dir"/*.js; do
      if grep -q "^import" "$file"; then
        imports=$(node_hp_extract_packages "$file")

        for pkg in $imports; do
          node_hp_install_package "$pkg"
        done
      fi
    done
  done
}

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
