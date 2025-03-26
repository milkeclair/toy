git_commit() {
  shift
  git commit -m "$@"
  echo ""
  echo "--- committer ---"
  echo "name: $(git config --local user.name)"
  echo "email: $(git config --local user.email)"
}
