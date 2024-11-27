git_current_branch() {
  if command git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    command git branch --show-current
  else
    echo ""
  fi
}
