@ECHO OFF

REM ---------------- CONFIGURATION ----------------
SET APP=Tube DL
SET APP_VERSION=2.0.2
SET APP_BUILD_VERSION=2.0.102
SET ELECTRON_VERSION=0.36.8

REM ----------------  BUILD FOR WINDOWS ---------------------

REM Clean previous build
rd /s /q "%APP%-win32-ia32" 2>nul

REM Build executable
electron-packager . "%APP%" --app-version=%APP_VERSION% --build-version=%APP_BUILD_VERSION% --platform=win32 --arch=ia32 --version=%ELECTRON_VERSION% --ignore="node_modules/electron-*|build-*|assets/bin/osx" --icon=assets\\images\\Icon.ico --overwrite
