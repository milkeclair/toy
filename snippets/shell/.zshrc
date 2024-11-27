source ~/.zsh/.git-prompt.sh
source ~/.zsh/bash_command.zsh
source ~/.zsh/git_command.zsh

# environment ------------------------------------------------------------------
export PATH="$HOME/.rbenv/bin:$PATH"
eval "$(rbenv init -)"

# zsh ------------------------------------------------------------------
setopt correct
setopt auto_cd
setopt hist_ignore_dups
setopt PROMPT_SUBST

fpath=(
  ${HOME}/.zsh/completions
  ${fpath}
)

autoload -Uz compinit
compinit

# prompt -----------------------------------------------------------------------

# example:
#   {cyan}~/dir1/dir2/dir3 {green}(branch)
#   $
PROMPT='
%F{cyan}~/${${PWD%/*/*}##*/}/${${PWD%/*}##*/}/${PWD##*/}%f %F{green}($(git_current_branch))%f
$ '

# alias ------------------------------------------------------------------------
alias ls="ls -a"
alias code="sudo code"
alias be="bundle exec"
alias berb="bundle exec ruby"
alias pry="sudo pry"
