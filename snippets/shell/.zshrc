git_author_stats() {
  # example: ("html" "css")
  exclude_exts=('html' 'css')
  # example: ('node_modules')
  exclude_dirs=("node_modules")
  local authors=($(git_hp_get_author_names))
  # example: ("drumcan smith" "dr mince") -> ("drumcan_smith" "dr_mince")
  local formatted_authors=($(git_hp_get_author_names | sed 's/ /_/g'))
  local previous_commits=0
  local previous_lines=(0 0)
  local index=1

  for author in "${authors[@]}"; do
    # inserted, deleted
    local commits=$(git_hp_get_commits "$author")
    local commit_count=$(git_hp_get_commit_count "$author")
    local inserted=$(echo $commits | awk '{print $1}')
    local deleted=$(echo $commits | awk '{print $2}')
    local total=$(git_hp_sum_lines "$inserted" "$deleted")

    # commit_count, (inserted, deleted) == previous_commits, previous_lines
    if git_hp_is_previous_author "$previous_commits" "$commit_count" "$previous_lines" "$commits"; then
      # remove duplicate author from authors
      authors=("${authors[@]/$author/}")
      continue
    fi

    local current_author=${formatted_authors[$index]}
    # example: author_name commit: 100 add: 1000 delete: 1000 total: 2000
    git_hp_print_author_logs "$current_author" "$commit_count" "$inserted" "$deleted" "$total"

    # setup for next
    previous_commits=$commit_count
    previous_lines=($commits)
    index=$((index + 1))
  done
}

git_hp_print_author_logs() {
  local red='\033[0;31m'
  local green='\033[0;32m'
  local orange='\033[0;33m'
  local purple='\033[0;35m'
  local cyan='\033[0;36m'
  local creset='\033[0m'
  local author=$1
  local commit_count=$2
  local inserted=$3
  local deleted=$4
  local total=$5

  # %-20s: ljust 20 for string
  # %-5d: ljust 5 for digit
  # example: author_name commit: 100 add: 1000 delete: 1000 total: 2000
  printf "%-20s commit: ${orange}%-5d${creset} add: ${green}%-7d${creset} delete: ${red}%-7d${creset} total: ${purple}%-7d${creset}\n" "$author" "$commit_count" "$inserted" "$deleted" "$total"
}

git_hp_sum_lines() {
  local inserted=$1
  local deleted=$2
  awk -v inserted="$inserted" -v deleted="$deleted" 'BEGIN {print inserted + deleted}'
}

git_hp_get_author_names() {
  local author_name='%an'
  git log --format="$author_name" |
    sort |
    uniq
}

git_hp_get_commit_count() {
  local author=$1
  # wc -l: count lines
  git log --oneline --author="$author" |
    wc -l
}

git_hp_get_commits() {
  local author=$1
  shift
  # grep -v -E: exclude files with specific extensions
  # example: \.(html|css)$
  local exclude_exts_pattern="\.($(
    IFS=\|
    echo "${exclude_exts[*]}"
  ))$"
  # example: /(node_modules|dist)/
  local exclude_dirs_pattern="($(
    IFS=\|
    echo "${exclude_dirs[*]}"
  ))/"

  git log --pretty=tformat: --numstat --author="$author" |
    grep -v -E "$exclude_exts_pattern|$exclude_dirs_pattern" |
    awk '{inserted+=$1; deleted+=$2} END {print inserted, deleted}'
}

git_hp_is_previous_author() {
  local previous_commits=$1
  local commit_count=$2
  local previous_lines=($3)
  local commits=($4)
  # commit_count, (inserted, deleted) == previous_commits, previous_lines
  if [[ $previous_commits == $commit_count && "${previous_lines[@]}" == "${commits[@]}" ]]; then
    return 0
  else
    return 1
  fi
}
