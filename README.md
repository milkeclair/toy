# コード置き場

- **javascript**
  - `server.sh`: start a server to check js
  - **pure**
    - `camelize.js`: camelize kebab or snake
    - `dig_nested_keys.js`: dig nested keys in object
    - `has_any_key.js`: check if object has any key?
    - `index.js`: entry point
    - `logger.js`: logging colorize message
  - **server**
    - `app.js`: creation and activation server
    - `node_controller.js`: controller for server
    - `node_logger.js`: logging server details
    - `node_middleware.js`: middleware for before response end
    - `node_renderer.js`: view renderer
    - `node_router.js`: routing for server
    - `node_server.js`: http server
    - `node_setup_functions.sh`: helper for server setup
    - `node_warden.js`: request warden
    - **assets**
      - **css**
    - **view**
      - `404.ejs`: not found page
      - `compare_code.ejs`: for check js in browser
      - **partial**
        - `_head.ejs`: metadata
- **ruby**
  - **pure**
    - `async_await.rb`: concurrent with thread
    - `compare_code.rb`: for develop
    - `debounce.rb`: debounce with thread
    - `multi_byte_ljust.rb`: left just for multiple byte string
    - `time_converter_from_seconds.rb`: learned closure
- **shell**
  - `.zshrc`: zshrc
  - `bash_command.zsh`: add util command for bash
  - `git_command.zsh`: add util command for git
  - **commands**
    - **bash**
      - `perm.zsh`: change directory and inner directories permission to me
      - `reload.zsh`: reload .zshrc
    - **git**
      - `author_stats.zsh`: show all authors commited stats with table format
      - `current_branch.zsh`: if inside work tree then show current branch
