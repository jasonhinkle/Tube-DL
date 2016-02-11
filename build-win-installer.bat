@ECHO OFF

REM ---------------- CONFIGURATION ----------------
SET APP=Tube DL

REM ----------------  BUILD INSTALLER ---------------------

REM Clean previous build
del "Tube DL Setup.exe" 2>nul

REM Build installer
electron-builder ".\\%APP%-win32-ia32" --platform=win --out=.\\ --config=.\\build-win-installer.json
