for file in ~/.zsh/commands/bash/*.zsh; do
  source "$file"
done

reload() {
  bash_reload
}

perm() {
  bash_perm
}

memo() {
  bash_memo "$@"
}
