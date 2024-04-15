@echo off
setlocal

REM Prompt user for Git installation
set /p gitInstalled="Do you have Git installed? If yes, type y, if not, type n: "

if /i "%gitInstalled%"=="n" (
    echo Installing Git...
    winget install --id Git.Git -e --source winget
)

REM Prompt user for NodeJS installation
set /p nodeJSInstalled="Do you have NodeJS installed? If yes, type y, if not, type n: "

if /i "%nodeJSInstalled%"=="n" (
    echo Installing NodeJS...
    if "%PROCESSOR_ARCHITECTURE%"=="AMD64" (
        set nodeInstallerUrl=https://nodejs.org/dist/latest/node-v16.0.0-x64.msi
    ) else (
        set nodeInstallerUrl=https://nodejs.org/dist/latest/node-v16.0.0-x86.msi
    )
    curl -o "%TEMP%\nodejs_installer.msi" "%nodeInstallerUrl%"
    msiexec /i "%TEMP%\nodejs_installer.msi" /quiet
    del "%TEMP%\nodejs_installer.msi"
)

REM Prompt user for GitHub Desktop installation
set /p githubInstalled="Do you have Github Desktop installed? If yes, type y, if not, type n: "

if /i "%githubInstalled%"=="n" (
    echo Installing GitHub Desktop...
    curl -o "%TEMP%\GitHubDesktopSetup.msi" "https://central.github.com/deployments/desktop/desktop/latest/win32?format=msi"
    msiexec /i "%TEMP%\GitHubDesktopSetup.msi" /quiet
    del "%TEMP%\GitHubDesktopSetup.msi"
)

endlocal