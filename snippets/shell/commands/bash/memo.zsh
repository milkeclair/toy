bash_memo() {
  local file=$1
  local flag=$2

  if [[ $flag == "-d" ]]; then
    rm ~/memo/$file.md
    return 0
  fi

  if [[ -z $file ]]; then
    file="memo.md"
  elif [[ ! -f ~/memo/$file.md ]]; then
    touch ~/memo/$file.md
    file="$file.md"
  fi

  code ~/memo/$file
}
