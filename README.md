# AutoProphet
AutoProphet is an open source financial analytics tool designed to provide financial analytics capabilties at a low cost. The tool is meant to provide novice investors with the opportunity to learn and explore financial analytics capabilities, beginning with a simple set of analytics tools and gradually learning more complex tools and models.


-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Installation
To begin contributing to the repository:

Download the follow software
1. Download GitHub Desktop: https://desktop.github.com/
   ![image](https://github.com/jeffreywallphd/AutoProphet/assets/148374675/6a62cd50-258f-4d9f-b302-d8e2880579ff)

2. Download VS Code: https://code.visualstudio.com/download

   ![Screenshot 2024-03-21 005424](https://github.com/jeffreywallphd/AutoProphet/assets/148374675/eaaaf10c-3bce-4f9d-91af-ca7598356319)

3. Download Node.js: https://nodejs.org/en/download

   ![Screenshot 2024-03-21 005335](https://github.com/jeffreywallphd/AutoProphet/assets/148374675/d7279af4-e1e1-448d-8915-38d3eac8fcfb)

   
4. Clone the repository by copying and pasting this link under the URL option: https://github.com/jeffreywallphd/AutoProphet.git


     ![Screenshot 2024-03-21 004049](https://github.com/jeffreywallphd/AutoProphet/assets/148374675/2a98257c-dea1-40df-abc2-ae74c9448274)

     ![Screenshot 2024-03-21 004125](https://github.com/jeffreywallphd/AutoProphet/assets/148374675/9f1cba35-5de3-4664-8b27-99f3d81a12e3)


5. Download & Unzip the following file by right clicking and then selecting "Extract All":
   
   a. [env.zip](https://github.com/jeffreywallphd/AutoProphet/files/14723882/env.zip)

   Note: Ask the professor for the specific key needed for this file.
   
   b. Make sure to add the key into this file by editing it. Then make sure to "save all" or "save as". You can double check that it was updated correctly by exiting out and clicking on the file once again.
   ![image](https://github.com/jeffreywallphd/AutoProphet/assets/148374675/ff66e719-0992-4eb6-9fcf-4cb842df9016)

   
 
   c. [default.zip](https://github.com/jeffreywallphd/AutoProphet/files/14721696/default.zip)


7. Click on the "env folder" that was extracted and copy the file inside.

   a. Then follow this file path or find a way to get to your GitHub folder in your file explorer: C:\Users\"your username"\OneDrive\Documents\GitHub  
  
     ![Screenshot 2024-03-21 004302](https://github.com/jeffreywallphd/AutoProphet/assets/148374675/e23fd755-2304-4a03-9f29-48920244f013)

   b. Click on the GitHub folder, then click on the AutoProphet folder.

   ![Screenshot 2024-03-21 004359](https://github.com/jeffreywallphd/AutoProphet/assets/148374675/b2f27373-57df-4e67-9cd9-ba9b3e2a9916)

   c. Paste the ".env" file into the AutoProphet folder by using the "Ctrl V" shortcup or the paste button in the upper left-hand corner.


8. Create a new folder in the "AutoProphet" folder and name it "config".
      a. <img width="494" alt="image" src="https://github.com/jeffreywallphd/AutoProphet/assets/148374675/a8d6f972-ce28-467f-b3e8-62a247217ddb">

      b. ![Screenshot 2024-03-21 004551](https://github.com/jeffreywallphd/AutoProphet/assets/148374675/972be37b-c777-45ef-b49b-52d00dcfa4ce)
      c. Return to your downloads folder in your file explorer and go to the "json" folder that was extracted.
      d. Click on the folder and copy the file inside.
      e. Paste the file into the new "config" folder you just created.
      ![Screenshot 2024-03-21 004616](https://github.com/jeffreywallphd/AutoProphet/assets/148374675/af607bd5-d1c8-4011-b060-f00e7cc86d25)

9.  Return to the "AutoProphet" folder and rename the folder to "auto-prophet" .

    ![image](https://github.com/jeffreywallphd/AutoProphet/assets/148374675/01cb5b3d-b7ec-4024-9d82-98682ccbfc67)

10. Open your command prompt by typing cmd .
       ![image](https://github.com/jeffreywallphd/AutoProphet/assets/148374675/41a4db2e-e70f-42a6-9121-2e6d1b43cefc)

      b. Type in "cd" and then past the file path to the GitHub folder:
   
      <img width="421" alt="step1ish" src="https://github.com/jeffreywallphd/AutoProphet/assets/148374675/74081e79-1095-4fc6-b407-213ccf23c028">
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
3. Install the nodeJS packages that the the application uses. In the command prompt on Windows or the terminal on Mac/Linux:
   1. Make sure you are in the directory where you cloned the repository using the cd and ls commands. You will want to select the directory within the project where the package.json file is located. Currently, this is in the auto-prophet folder within the root folder.
   2. Once you have selected the directory, to install the NodeJS packages used for the project, run the command: npm install
4. Now you need to configure the application. Configuration is currently limited.
   1. Create a folder named config in the folder containing the package.json file (this is currently the auto-prophet folder).
   2. Within the config folder, create a file named default.json
   3. Paste the following into the default.json file:
      {"StockGateway": "AlphaVantageStockGateway","NewsGateway": "AlphaVantageNewsGateway"}
5. TO UTILIZE PRICE/VOLUME FEATURES: Store an API key in a .env file.
   1. If you do not have one already, get a free Alpha Vantage API key from https://www.alphavantage.co/support/#api-key.
   2. Create a file called ".env" in the auto-prophet folder.
   3. In that .env file, create a JSON object in the following form:
        {
            "ALPHAVANTAGE_API_KEY": "your key here"
        }
   4. Save your .env file and now you can use price/volume features that pull data from the Alpha Vantage API.
6. After installing the npm packages, adding the config folder and file, and creating the .env file, you are ready to run the application. Type the following command to launch the Electron application: npm start
   1. After the startup finishes, you should see the desktop interface for the application 

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



