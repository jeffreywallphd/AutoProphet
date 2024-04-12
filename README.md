# AutoProphet
AutoProphet is an open source financial analytics tool designed to provide financial analytics capabilties at a low cost. The tool is meant to provide novice investors with the opportunity to learn and explore financial analytics capabilities, beginning with a simple set of analytics tools and gradually learning more complex tools and models.

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

## Installation
To begin contributing to the repository follow the instructions below. If you are familiar with software development, please follow the quick install instructions. If you are new to software development, a more detailed set of instructions can be found after the quick install instructions.

### Quick Install Instructions
1. Ensure you have a version of git installed on your computer appropriate for your operating system
2. Download and install NodeJS: https://nodejs.org/en/download
3. Clone the repository: https://github.com/jeffreywallphd/AutoProphet.git
4. In the auto-prophet folder, create a folder named: config
   * Create a file in the config folder named: default.json
   * Add the following to the default.json file: { "StockGateway": "AlphaVantageStockGateway", "NewsGateway": "AlphaVantageNewsGateway", "ReportGateway": "AlphaVantageRatioGateway"}
5. In the auto-prophet folder, create a file named: .env
   * Add the following to the .env file: {"ALPHAVANTAGE_API_KEY": "your_key_here", "FMP_API_KEY": "your_key_here"}
   * Replace your_key_here with a free AlphaVantage key found here: https://www.alphavantage.co/support/#api-key
   * Replace your_key_here with a free Financial Modeling Prep key, which requires account signup here: https://site.financialmodelingprep.com/. After signup, the key can be found in the Dashboard.
6. Install the project dependencies in the terminal/command line, by running: npm install
7. To see the existing software, run: npm start
8. The application should load in an Electron window.


### Detailed Install Instructions
The following instructions provide greater detail for contributors new to software development.

#### Download the following software
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


6. Click on the "env folder" that was extracted and copy the file inside.

   a. Then follow this file path or find a way to get to your GitHub folder in your file explorer: C:\Users\"your username"\OneDrive\Documents\GitHub  
  
     ![Screenshot 2024-03-21 004302](https://github.com/jeffreywallphd/AutoProphet/assets/148374675/e23fd755-2304-4a03-9f29-48920244f013)

   b. Click on the GitHub folder, then click on the AutoProphet folder.

   ![Screenshot 2024-03-21 004359](https://github.com/jeffreywallphd/AutoProphet/assets/148374675/b2f27373-57df-4e67-9cd9-ba9b3e2a9916)

   c. Paste the ".env" file into the AutoProphet folder by using the "Ctrl V" shortcut or the paste button in the upper left-hand corner.


7. Create a new folder in the "AutoProphet" folder and name it "config".
   
   a. ![Screenshot 2024-03-21 004551](https://github.com/jeffreywallphd/AutoProphet/assets/148374675/6534f348-de7e-4033-b5e4-e395fa5b577b)

   b. Return to your downloads folder in your file explorer and go to the "json" folder that was extracted.
   
   c. Click on the folder and copy the file inside.
   
   d. Paste the file into the new "config" folder you just created.
      ![Screenshot 2024-03-21 004616](https://github.com/jeffreywallphd/AutoProphet/assets/148374675/af607bd5-d1c8-4011-b060-f00e7cc86d25)

8.  Return to the "AutoProphet" folder and rename the folder to "auto-prophet" .

      ![Screenshot 2024-03-21 004359](https://github.com/jeffreywallphd/AutoProphet/assets/148374675/1d946841-2ddc-4184-a2d3-77a19a43cfd2)


9. Open your command prompt by typing "cmd".
       ![image](https://github.com/jeffreywallphd/AutoProphet/assets/148374675/41a4db2e-e70f-42a6-9121-2e6d1b43cefc)

      b. Type in "cd" and then past the file path to the GitHub folder:
   
      <img width="421" alt="step1ish" src="https://github.com/jeffreywallphd/AutoProphet/assets/148374675/74081e79-1095-4fc6-b407-213ccf23c028">
      
      c. If you are not sure how to find and copy the file path this is how: Right click on the GitHub folder and select "copy as path".
         ![image](https://github.com/jeffreywallphd/AutoProphet/assets/148374675/c383754a-63c0-4745-a8a0-1c7a57f8603a)

10. Next type in "cd auto-prophet" in the command prompt.

     <img width="407" alt="step3ish" src="https://github.com/jeffreywallphd/AutoProphet/assets/148374675/55c7f90e-c12d-4eb0-8aae-d558c90e670e">

11. Then type in "npm install"

    <img width="465" alt="step5ish" src="https://github.com/jeffreywallphd/AutoProphet/assets/148374675/111363a0-903b-4fc7-a921-41024a63d9a4">

12. Lastly, type the following command "npm start"

    <img width="457" alt="step6ish" src="https://github.com/jeffreywallphd/AutoProphet/assets/148374675/4196753d-345a-4761-98e5-3dbf6ce8b097"> 

13. After the startup finishes, you should see the desktop interface for the application.
    
   ![image](https://github.com/jeffreywallphd/AutoProphet/assets/148374675/49f89a90-80a7-4131-b29c-1da810177050)

## Commands After Install: 
1. cd "file path to GitHub"
2. cd auto-prophet
3. npm start
      
## Disclaimers

### No Warranty
This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.

### Disclaimer of Liability
The authors and copyright holders of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.

### General Use Disclaimer
The authors of this software are not financial experts. This software should not be used to replace the expert advice of financial professionals. The information and functionality of this software is for research and educational purposes. Consult a licensed professional for investing advice.

## Collaboration Practices
Please be sure to read through the [Best Coding Practices](BestCodingPractices.md) document before you start collaborating.

As you use git and GitHub to manager your contributions, follow the guidelines outlined in the [Git Practices](GitPractices.md) document. Remember to pull from main regularly to avoid code conflicts.

## Future Feature Ideas
To contribute feature ideas or to see other's ideas for features, please see the [Issues](https://github.com/jeffreywallphd/AutoProphet/issues) section of this repository. Your ideas are welcome. Please tag your feature ideas as "enhancements" so they are easy to find. 

## Acknowledgments
All gratitude to the Michigan Tech students who worked on this project to develop IT and FinTech knowledge and skills through their coursework and share their contributions.

### Core Contributors
* Jeffrey Wall - Faculty Advisor
* Students at Michigan Technological University in MIS 4100 - Emerging Technologies: Fall 2023
* Students at Michigan Technological University in MIS 3200 - Systems Analysis and Design: Spring 2024

### Dependencies
Please see the package.json file in the auto-prophet folder for a list of the dependencies used in this project.


