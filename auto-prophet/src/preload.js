const path = require('path');
const { contextBridge } = require('electron')
const { promises: fsPromises } = require('fs');
const fs = require('fs');
  
contextBridge.exposeInMainWorld('fsApi', {
    logData: (data) => {
        console.log(data);
    },
    readFile: async (filePath) => {
        try {
            const fullPath = path.join(__dirname, filePath);
            await fsPromises.readFile(fullPath, 'utf-8').then(data => {
                return data;
            }).catch(error => {
                console.log("Could not read the file: ", error);
            });
        } catch(error) {
            console.error("Could not read file: ", error);
        }
    },
    readFileSync: (filePath) => {
        try {
            const fullPath = path.join(__dirname, filePath);
            const data = fs.readFileSync(fullPath, 'utf-8');
            return data;
        } catch(error) {
            console.error("Could not read file: ", error);
        }
    },
    writeFile: async (filePath, data) => {
        try {
            const fullPath = path.join(__dirname, filePath);
            await fsPromises.writeFile(fullPath, data, 'utf-8');
        } catch(error) {
            console.error("Could not write file: ", error);
        }
    },
    writeFileSync: (filePath, data) => {
        try {
            const fullPath = path.join(__dirname, filePath);
            fs.writeFileSync(fullPath, data);
        } catch(error) {
            console.error("Could not write file: ", error);
        }
    },
    directoryExistsSync: (folderPath) => {
        try {
            fs.accessSync(folderPath);
            return true;
        } catch(error) {
            console.error("An error occurred while trying to check if the directory exists: ", error);
            return false;
        }
    },
    directoryExists: async (folderPath) => {
        try {
            await fsPromises.access(folderPath);
            return true;
        } catch(error) {
            return false;
        }
    },
    makeDirectorySync: (folderPath) => {
        try {
            const fullPath = path.join(__dirname, folderPath);
            fs.mkdirSync(fullPath);
        } catch(error) {
            console.error("Could not create the directory", error);
        }
    },
    makeDirectory: async (folderPath) => {
        try {
            const fullPath = path.join(__dirname, folderPath);
            await fsPromises.mkdir(fullPath);
        } catch(error) {
            console.error("Could not create the directory", error);
        }
    },
    // Restrict exposed functions to accept only strings and return only strings
    serializeArgs: ['string'],
    deserializeReturns: ['string'],
});
