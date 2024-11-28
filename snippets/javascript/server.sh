source ./server/node_setup_functions.sh

node_start_server() {
  local dirs=("./pure" "./server")
  node_setup_dependencies "${dirs[@]}"

  echo -e "\n-- starting server ---\n"
  npm start
}

node_start_server
