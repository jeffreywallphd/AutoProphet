# AutoProphet
AutoProphet is an open source financial analytics tool designed to provide financial analytics capabilties at a low cost. The tool is meant to provide novice investors with the opportunity to learn and explore financial analytics capabilities, beginning with a simple set of analytics tools and gradually learning more complex tools and models.

## Disclaimers

### No Warranty
This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.

### Disclaimer of Liability
The authors and copyright holders of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.

### General Use Disclaimer
The authors of this software are not financial experts. This software should not be used to replace the expert advice of financial professionals. The information and functionality of this software is for research and educational purposes. Consult a licensed professional for investing advice.

## Installation
To begin contributing to the repository:

1. Clone the repository using git into a folder on your computer where you want to store the code locally
   1. Windows users can install Git for Windows. After installing, you will clone the repository using GitBash.
      1. Within GitBash, use the cd (change directory) and ls (list) commands to select the directory where you will clone the files.
      2. After selecting the directory with the cd command, run: git clone https://github.com/jeffreywallphd/AutoProphet.git
      3. Check the directory to make sure that it now has the files from the GitHub repository
   2. Many IDE's also have this capability to clone repositories if you don't like using command line tools. Follow a similar process. 
2. Install nodeJS by visiting: https://nodejs.org/en/download
   1. By default it should install npm, which is a package manager for NodeJS. You will need npm installed.
3. In the command prompt on Windows or the terminal on Mac/Linux:
   1. Make sure you are in the directory where you cloned the repository using the cd and ls commands. You will want to select the directory within the project where the package.json file is located. Currently, this is in the auto-prophet folder within the main folder.
   2. Once you have selected the directory, to install the NodeJS packages used for the project, run the command: npm install
4. After installing the npm packages, run the following command to launch the Electron application: npm start
   1. After the startup finishes, you should see the desktop interface for the application 
5. TO UTILIZE PRICE/VOLUME FEATURES: Store an API key in a .env file.
   1. If you do not have one already, get a free Alpha Vantage API key from https://www.alphavantage.co/support/#api-key.
   2. Create a file called ".env" in the auto-prophet folder.
   3. In that .env file, create a JSON object in the following form:
        {
            "ALPHAVANTAGE_API_KEY": "your key here"
        }
   4. Save your .env file and now you can use price/volume features that pull data from the Alpha Vantage API.

## Collaboration Practices
Please be sure to read through the [Best Coding Practices](BestCodingPractices.md) document before you start collaborating.

As you use git and GitHub to manager your contributions, follow the guidelines outlined in the [Git Practices](GitPractices.md) document. Remember to pull from main regularly to avoid code conflicts.

## Future Feature Ideas
* Utilize the Recharts React visualization library: https://recharts.org/en-US

## Acknowledgments
All gratitude to the authors of this project for their valuable input and assistance.

### Authors
* Jeffrey Wall - Faculty Advisor
* Daron Hebeler
* Trent Bennett
* Josh Breitenbach
* Tracy Gaolese
* Hanna Hiltunen
* Donovan Korth
* Bester Mangisoni
* Lizzie Schnell
* Zack Stone
* Maggie Zimmermann

### Dependencies
* Node js
* NPM



