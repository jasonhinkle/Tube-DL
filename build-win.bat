
REM ---------------- CONFIGURATION ----------------
SET APP=Tube DL
SET APP_VERSION=2.0.1
SET APP_BUILD_VERSION=2.0.102
SET ELECTRON_VERSION=0.36.7

REM ----------------  BUILD FOR WINDOWS ---------------------

REM Clean previous build
rd /s /q %APP%-win-x64

REM Build executable
electron-packager . "%APP%" --app-version=%APP_VERSION% --build-version=%APP_BUILD_VERSION% --platform=win --arch=x64 --version=$ELECTRON_VERSION% --ignore="node_modules/electron-*|assets/bin/osx" --overwrite
