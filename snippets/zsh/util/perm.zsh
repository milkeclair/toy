bash_perm() {
  local dir=$1
  if [[ $dir == $(whoami) ]]; then
    dir=$HOME
  fi

  local arg_count=$#

  if [[ $arg_count -ne 1 ]]; then
    echo -e "wrong number of arguments\n given: $arg_count expected: 1"
    return 1
  elif [[ ! -d $dir ]]; then
    echo "$dir is not a directory"
    return 1
  fi

  echo -e "change owner\n to: $(whoami)\n directory: $dir"
  sudo chown -R "$(whoami)" "$dir"
}
