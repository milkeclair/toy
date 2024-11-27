for file in ~/.zsh/commands/git/*.zsh; do
  source "$file"
done

git() {
  case $1 in
  "stats")
    git_author_stats
    ;;
  "current")
    git_current_branch
    ;;
  *)
    command git "$@"
    ;;
  esac
}
