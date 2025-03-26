@echo off

:: Change the following to your preferred values
set HOST_NAME=example.com
set PROTOCOL=https
set URL=localhost:80

:main
  call :install_cloudflared
  call :dig_tunnel_to_server
exit

:: private

:: null->void
:install_cloudflared
  echo --------------------------------------------------
  echo Step1: Install Cloudflared
  echo --------------------------------------------------

  winget install --id Cloudflare.cloudflared

  echo.
  echo Successfully installed
  echo.
exit /b

:: null->void
:dig_tunnel_to_server
  echo --------------------------------------------------
  echo Step2: Dig tunnel to server
  echo --------------------------------------------------

  echo if you need to stop the tunnel, press Ctrl+C
  cloudflared access "%PROTOCOL%" --hostname "%HOST_NAME%" --url "%URL%"
exit /b