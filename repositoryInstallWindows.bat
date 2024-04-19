REM Created by tsheets@mtu.edu 4/16/24
REM Used for installing programs nessesary for AutoProphet development as well as the repository itself. Provides instalation options as well. 
@echo off
setlocal

REM Ask user install options
echo Welcome to the AutoProphet Development Installer! There are three options below for intsallation.
echo IMPORTANT: Make sure this script is in the location you wan tthe repository to be cloned if applicable
echo 1. Full Install (Downloads Git, NodeJS, Github) and clones and installs AutoProphet repository. (Will remove and reinstall repository if present)
echo 2. Clone and Install AutoProphet Repository only. (Will remove and reinstall repository if present)
echo 3. Choose each option individually. (Will remove and reinstall repository if present)
set /p userOption="Please pick the option that best suits you: "

if %userOption%==1 goto 1
if %userOption%==2 goto 2
if %userOption%==3 goto 3

:1 REM Install everything
REM Git Install
echo Installing Git...
winget install --id Git.Git -e --source winget

REM NodeJS Install
echo Installing NodeJS...
if "%PROCESSOR_ARCHITECTURE%"=="AMD64" (
    bitsadmin /transfer nodejsInstaller /priority normal https://nodejs.org/dist/v21.7.3/node-v21.7.3-x64.msi "%TEMP%\nodejs_installer.msi"
) else (
    bitsadmin /transfer nodejsInstaller /priority normal https://nodejs.org/dist/v21.7.3/node-v21.7.3-x86.msi "%TEMP%\nodejs_installer.msi"
)
msiexec /i "%TEMP%\nodejs_installer.msi"
del "%TEMP%\nodejs_installer.msi"

REM Github Desktop Install
echo Installing GitHub Desktop...
curl -L -o "%TEMP%\GitHubDesktopSetup.msi" "https://central.github.com/deployments/desktop/desktop/latest/win32?format=msi"
msiexec /i "%TEMP%\GitHubDesktopSetup.msi" 
start C:\"Program Files (x86)"\"GitHub Desktop Deployment"\GitHubDesktopDeploymentTool.exe"
del "%TEMP%\GitHubDesktopSetup.msi"

REM Repository Cloning and Install
if exist "%CD%\AutoProphet" (
    echo Removing existing directory...
    rd /s /q "%CD%\AutoProphet"
)
git clone https://github.com/jeffreywallphd/AutoProphet
cd AutoProphet
cd auto-prophet
npm install
set /p exit="Process done, select any key to exit"
exit;


:2 REM Repository Cloning and Install
if exist "%CD%\AutoProphet" (
    echo Removing existing directory...
    rd /s /q "%CD%\AutoProphet"
)
git clone https://github.com/jeffreywallphd/AutoProphet
cd AutoProphet
cd auto-prophet
npm install
set /p exit="Process done, select any key to exit"
exit;


:3 REM Choose each option individually
REM Make sure user has .bat file in correct directory
set /P locationQuestion="Do you have this script in the location you want the repository cloned? (Doesn't matter if not cloning.) If yes, type y, if not, type n AND PLACE IN DESIRED LOCATION: "

if /i "%locationQuestion%"=="n" (
    exit
)

REM Prompt user for Git installation
set /P gitChoice="Do you want to install Git? If yes, type y, if not, type n: "

if /i "%gitChoice%"=="y" (
    echo Installing Git...
    winget install --id Git.Git -e --source winget
)

REM Prompt user for NodeJS installation
set /P nodeJSChoice="Do you want to install NodeJS? If yes, type y, if not, type n: "

if /i "%nodeJSChoice%"=="y" (
    echo Installing NodeJS...
    if "%PROCESSOR_ARCHITECTURE%"=="AMD64" (
        bitsadmin /transfer nodejsInstaller /priority normal https://nodejs.org/dist/v21.7.3/node-v21.7.3-x64.msi "%TEMP%\nodejs_installer.msi"
    ) else (
        bitsadmin /transfer nodejsInstaller /priority normal https://nodejs.org/dist/v21.7.3/node-v21.7.3-x86.msi "%TEMP%\nodejs_installer.msi"
    )
    msiexec /i "%TEMP%\nodejs_installer.msi"
    del "%TEMP%\nodejs_installer.msi"
)

REM Prompt user for GitHub Desktop installation
set /P githubPresent="Do you want to install Github Desktop? If yes, type y, if not, type n: "
if /i "%githubPresent%"=="y" (
    echo Installing GitHub Desktop...
    curl -L -o "%TEMP%\GitHubDesktopSetup.msi" "https://central.github.com/deployments/desktop/desktop/latest/win32?format=msi"
    msiexec /i "%TEMP%\GitHubDesktopSetup.msi" 
    start C:\"Program Files (x86)"\"GitHub Desktop Deployment"\GitHubDesktopDeploymentTool.exe"
    del "%TEMP%\GitHubDesktopSetup.msi"
)

REM Prompt user for Repository cloning
set /P cloneChoice="Do you want to clone the AutoProphet repository here? If yes, type y, if not, type n:"
if /i "%cloneChoice%"=="y" (
    if exist "%CD%\AutoProphet" (
        echo Removing existing directory...
        rd /s /q "%CD%\AutoProphet"
    )
    git clone https://github.com/jeffreywallphd/AutoProphet
    cd AutoProphet
    cd auto-prophet
    npm install
)    
set /p exit="Process done, select any key to exit"
exit;

endlocal