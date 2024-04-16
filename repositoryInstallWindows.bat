@echo off
setlocal

REM Ask user install options
set /p isntallOption="Type a letter below for acoresponding install expereince:"

REM Make sure user has .bat file in correct directory
set /p locationQuestion="Do you have this script in the location you want the repository cloned? (Doesn't matter if not cloning.) If yes, type y, if not, type n AND PLACE IN DESIRED LOCATION: "

if /i "%locationQuestion%"=="n" (
    exit
)

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
        bitsadmin /transfer nodejsInstaller /priority normal https://nodejs.org/dist/v21.7.3/node-v21.7.3-x64.msi "%TEMP%\nodejs_installer.msi"
    ) else (
        bitsadmin /transfer nodejsInstaller /priority normal https://nodejs.org/dist/v21.7.3/node-v21.7.3-x86.msi "%TEMP%\nodejs_installer.msi"
    )
    msiexec /i "%TEMP%\nodejs_installer.msi" /quiet
    del "%TEMP%\nodejs_installer.msi"
)

REM Prompt user for GitHub Desktop installation
set /p githubInstalled="Do you have Github Desktop installed? If yes, type y, if not, type n: "
if /i "%githubInstalled%"=="n" (
    echo Installing GitHub Desktop...
    curl -L -o "%TEMP%\GitHubDesktopSetup.msi" "https://central.github.com/deployments/desktop/desktop/latest/win32?format=msi"
    msiexec /i "%TEMP%\GitHubDesktopSetup.msi" /quiet
    del "%TEMP%\GitHubDesktopSetup.msi"
)
echo %githubInstalled%

REM Prompt user for Repository cloning
set /p cloneChoice="Do you want to clone the AutoProphet repository here? If yes, type y, if not, type n:"
if /i "%githubInstalled%"=="y" (
    if exist "%CD%\AutoProphet" (
        echo Removing existing directory...
        rd /s /q "%CD%\AutoProphet"
    )
    git clone https://github.com/jeffreywallphd/AutoProphet
    cd AutoProphet
    cd auto-prophet
    npm install
)    

endlocal