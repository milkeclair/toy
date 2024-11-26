cd ./server

source ./node_setup_functions.sh
node_setup_dependencies

echo -e "\n-- starting server ---\n"
node server.js
