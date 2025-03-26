@echo off
setlocal enabledelayedexpansion

:main
  call :padding 123 5
  pause
exit /b

:: num:int, length:int->void
:padding
  set NUM=%1
  set LENGTH=%2
  set NUM=%NUM: =%
  set PADDING=0000000000
  set NUM=%PADDING%%NUM%
  set NUM=!NUM:~-%LENGTH%!
  echo !NUM!
exit /b

endlocal