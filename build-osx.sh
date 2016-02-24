#!/bin/bash

# ---------------- CONFIGURATION ----------------
APP="Tube DL"
APP_BUNDLE_ID="com.verysimple.tubedl"
APP_VERSION="2.0.2"
APP_BUILD_VERSION="2.0.102"
ELECTRON_VERSION="0.36.8"

# ----------------  BUILD FOR DARWIN ---------------------

# Clean previous build
rm -rf "$APP-darwin-x64"

# Build executable
electron-packager . "$APP" --app-bundle-id=$APP_BUNDLE_ID --helper-bundle-id=$APP_BUNDLE_ID.helper --app-version=$APP_VERSION --build-version=$APP_BUILD_VERSION --platform=darwin --arch=x64 --version=$ELECTRON_VERSION --ignore="node_modules/electron-*|assets/bin/win" --icon=./assets/images/Icon.icns --overwrite
