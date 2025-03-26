bash_memo() {
  local file=$1
  local flag=$2

  if [[ $flag == "-d" ]]; then
    rm ~/memo/$file.md
    return 0
  fi

  if [[ -z $file ]]; then
    file="memo.md"
  elif [[ ! -f ~/memo/$file.md && ! -f ~/memo/$file ]]; then
    touch ~/memo/$file.md
  fi

  code ~/memo/$file
}

_bash_memo_completions() {
  local files=($(ls ~/memo))
  _values \
    "" \
    "${files[@]}"
}

compdef _bash_memo_completions memo
