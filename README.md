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
   * Add the following to the default.json file: 
   ```
   { 
      "StockGateway": "AlphaVantageStockGateway", 
      "NewsGateway": "AlphaVantageNewsGateway", 
      "ReportGateway": "AlphaVantageRatioGateway"
   }
   ```
5. In the auto-prophet folder, create a file named: .env
   * Add the following to the .env file: 
   ```
      {
         "ALPHAVANTAGE_API_KEY": "your_api_key_here",
         "FMP_API_KEY" : "your_api_key_here"
      }
   ```
   * Replace your_key_here with a free AlphaVantage key found here: https://www.alphavantage.co/support/#api-key
   * Replace your_key_here with a free Financial Modeling Prep key, which requires account signup here: https://site.financialmodelingprep.com/. After signup, the key can be found in the Dashboard.
6. Install the project dependencies in the terminal/command line, by running: npm install
7. To see the existing software, run: npm start
8. The application should load in an Electron window.


### Detailed Install Instructions
The following instructions provide greater detail for contributors new to software development.

#### Software you may find useful when working on this project
1. To interact with this repository, you will need a version of git on your computer. Git is a program that allows you to store project files on a local repository on your computer that can communicate with this remote GitHub repository. There are some options that you can use for this purpose:
   * GitHub Desktop (for Windows and Mac): https://desktop.github.com/
   * Git for Windows: https://gitforwindows.org/
   * Git for Mac: https://git-scm.com/download/mac

2. To view/edit code, contribute to documentation, or work with the folder and file structure of the software, you will need an integrated development environment (IDE). IDE's have many tools to help you build software. You can also use many IDEs to run git commands using simple user interface tools. 
   * A common IDE that supports multiple programming languages is VS Code. 
   * VS code will also allow you make connections with GitHub. You may still need a tool like Git for Windows for VS code to properly integrate with GitHub.
   * Download VS Code at: https://code.visualstudio.com/download

3. This software project utilizes NodeJS. Before you can successfully work on this project, you will need to download NodeJS. NodeJS will also install the node package manager (npm). You will use npm to install Javascript packages and start the software.  
   * Download Node.js at: https://nodejs.org/en/download
   ![Screenshot 2024-03-21 005335](https://github.com/jeffreywallphd/AutoProphet/assets/148374675/d7279af4-e1e1-448d-8915-38d3eac8fcfb)

#### Setting up the project environment
To contribute to the software project, you will need to set up the project environment so that you can view the code and run the software for testing purposes. The following steps will help you prepare your environment to run the software.

1. First, you will need to clone the repository. Cloning a repository copies the code from the GitHub repository to the repository on your local computer. There are multiple tools you can use to clone a repository. If you like command line tools, you can use GitBash, which comes with Git for Windows. If you prefer a graphical user interface, you can use GitHub Destkop or VS Code. 
   * You will need the following repository URL to clone this repository: https://github.com/jeffreywallphd/AutoProphet.git
   * To clone a repository on GitHub Desktop, click File -> Clone repository. You will then paste the repository URL above and select a location to store the files on your computer.

     ![Screenshot 2024-03-21 004049](https://github.com/jeffreywallphd/AutoProphet/assets/148374675/2a98257c-dea1-40df-abc2-ae74c9448274)

     ![Screenshot 2024-03-21 004125](https://github.com/jeffreywallphd/AutoProphet/assets/148374675/9f1cba35-5de3-4664-8b27-99f3d81a12e3)

   * You can also clone a repository within VS code. Click the source control icon in the left sidebar. Click the Clone Repository button. Paste the repository URL into the bar that appears at the top of the screen and click Clone from URL.
   ![Cloning](https://github.com/jeffreywallphd/AutoProphet/tree/main/documentation/images/vs_code_cloning.png)

2. Once you clone the repository, you will need to add a couple of folders and files that should only exist on your computer. For security and other reasons, some files should not exist on a public GitHub repository. 

   a. The first file you will need to create is a file you will name: .env
      * The .env file can be used store API keys, passwords, and other secrets that should not be shared on GitHub, but that are also necessary for the software to run.
      * To make this point vitally clear, never store passwords, API keys, or other secrets on a remote repository. 
      * To create this .env file, open the project in VS Code. Make sure the Explorer window is open in the left sidebar of VS Code. Within the Explorer, right click on the auto-prophet folder and select: New File...
      ![NewFile](https://github.com/jeffreywallphd/AutoProphet/tree/main/documentation/images/vs_code_create_env.png)
      * A text field will appear where you can type a name for the file. The name of the file must be: .env
      * Click Enter on your keyboard and the file will be created. The file will also be opened in the VS Code editing window. 
      * The project current stores two API keys, one to extract stock, news, and other financial data from the AlphaVantage API and another to extract the same from the Financial Modeling Prep (FMP) API. Paste the following JSON code into the file:
      ```
      {
         "ALPHAVANTAGE_API_KEY": "your_api_key_here",
         "FMP_API_KEY" : "your_api_key_here"
      }
      ```
      * You will need to replace the your_api_key_here with keys from the AlphaVantage and FMP APIs. 
      * You can obtain a free AlphaVantage API key at: https://www.alphavantage.co/support/#api-key
      * You can obtain a free FMP API key after creating an FMP account, logging in, and visiting the Dashboard at: https://site.financialmodelingprep.com/  
      * Note: If you are a student in a class, ask the professor for a key. Your professor may be able to provide you with a premium key for free for educational purposes.
 
   b. Second, you will need to create a folder to store configuration information. The AutoProphet project is designed to be configurable. For example, you can choose different data providers for stock price and volume data, SEC financial statements, financial news, etc.
      * Create a folder in the auto-prophet folder called **config**. Do this in the Explorer window by right clicking the auto-prophet folder and clicking: New Folder...
      * A text field will appear where you can type: config.
      * Once the folder is created, add a file inside the config folder named: **default.json**. This file will store information about which data sources to use.
      * Paste the following code into the file:
      ```
      { 
         "StockGateway": "AlphaVantageStockGateway", 
         "NewsGateway": "AlphaVantageNewsGateway", 
         "ReportGateway": "AlphaVantageRatioGateway"
      }
      ```

3. With the repository cloned and the .env and config/default.json files created, you are now ready to start the program. If you haven't already done so, you will need to install NodeJS mentioned earlier. To run the program, open the terminal/command line. 
   * VS Code has a terminal built in. To access the terminal in VS Code, Click the View -> Terminal option from the top menu bar. 
   * You will need to point the terminal to the auto-prophet folder. This can be done with the cd command (i.e., change directory). If you are in VS Code, simply type the following and press Enter: **cd auto-prophet**
   <img width="407" alt="step3ish" src="https://github.com/jeffreywallphd/AutoProphet/assets/148374675/55c7f90e-c12d-4eb0-8aae-d558c90e670e">
   * Now that the terminal is pointed to the auto-prophet directory, you can install the code resources (i.e., dependencies) the project uses. To do this, type the following command into the terminal: **npm install**
   <img width="465" alt="step5ish" src="https://github.com/jeffreywallphd/AutoProphet/assets/148374675/111363a0-903b-4fc7-a921-41024a63d9a4">
   * After the dependency packages have been installed, you can start the software by running the command in the terminal: **npm start**
   <img width="457" alt="step6ish" src="https://github.com/jeffreywallphd/AutoProphet/assets/148374675/4196753d-345a-4761-98e5-3dbf6ce8b097">
   * Note. If you are using Windows command prompt, you can copy the file path by right clicking on the GitHub folder in your file system and selecting "copy as path". You can paste that after the cd command.
   ![image](https://github.com/jeffreywallphd/AutoProphet/assets/148374675/c383754a-63c0-4745-a8a0-1c7a57f8603a)     
4. After the install and startup finishes, you should see the desktop interface for the application.
    
   ![image](https://github.com/jeffreywallphd/AutoProphet/assets/148374675/49f89a90-80a7-4131-b29c-1da810177050)

5. Whenever you want to start the project to view what your code changes did to the software, simply use the terminal to get to the auto-prophet folder and run: **npm start**
   * If you need to start over at any point by re-cloning the GitHub project, you may also need to repeat these steps. 
      
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


