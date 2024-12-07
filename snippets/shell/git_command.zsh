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
  "plog")
    git_pretty_log
    ;;
  "user")
    git_user "$@"
    ;;
  *)
    command git "$@"
    ;;
  esac
}
