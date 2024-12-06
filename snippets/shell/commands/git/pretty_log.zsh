git_pretty_log() {
  local ftime='%y/%m/%d %R'
  local hash='%C(yellow)%h%Creset'
  local date='%C(green)%cd%Creset'
  local author='%C(cyan)%cn%Creset'
  local branch='%C(auto)%d%Creset'
  local subject='%s'
  local line_style='%w(120,1,1)'
  local body='%b'

  # example:
  #  * 1a2b3c [24/12/31 23:59] author (HEAD -> main)
  #    feat: add some feature
  git log --graph \
    --date=format:"$ftime" \
    --pretty=format:" $hash [$date] $author$branch%n $subject%n$line_style$body"
}
