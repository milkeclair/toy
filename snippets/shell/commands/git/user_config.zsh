git_user() {
  shift
  if git_hp_is_set "$1"; then
    shift
    git_hp_set_user "$@"
  else
    git_hp_get_user
  fi
}

# helper

git_hp_set_user() {
  echo "--- set local user info ---"
  if [[ -z $1 && -z $2 ]]; then
    echo "require user.name"
    echo "require user.email"
    return 1
  elif [[ -z $1 ]]; then
    echo "require user.name"
    return 1
  elif [[ -z $2 ]]; then
    echo "require user.email"
    return 1
  fi

  git config --local user.name "$1"
  git config --local user.email "$2"
  echo "set user.name: $1"
  echo "set user.email: $2"
}

git_hp_get_user() {
  echo "--- local user info ---"
  local_user_name=$(git config --local user.name)
  local_user_email=$(git config --local user.email)
  echo "user.name: $local_user_name"
  echo "user.email: $local_user_email"
  echo ""
  echo "--- global user info ---"
  global_user_name=$(git config --global user.name)
  global_user_email=$(git config --global user.email)
  echo "user.name: $global_user_name"
  echo "user.email: $global_user_email"
}

git_hp_is_set() {
  if [[ $1 = --set ]]; then
    return 0
  else
    return 1
  fi
}
