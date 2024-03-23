const path = require('path');
const { contextBridge } = require('electron')
const { promises: fsPromises } = require('fs');
const fs = require('fs');
  
contextBridge.exposeInMainWorld('fsApi', {
    logData: (data) => {
        console.log(data);
    },
    readFileSync: (filePath) => {
        try {
            const fullPath = path.join(__dirname, filePath);
            const data = fs.readFileSync(fullPath, 'utf-8');
            return data;
        } catch(error) {
            console.error("Could not read file: ", error);
            return false;
        }
    },
    writeFileSync: (filePath, data) => {
        try {
            const fullPath = path.join(__dirname, filePath);
            fs.writeFileSync(fullPath, data);
            return true;
        } catch(error) {
            //console.error("Could not write file: ", error);
            return false;
        }
    },
    makeDirectorySync: (folderPath) => {
        try {
            const fullPath = path.join(__dirname, folderPath);
            fs.mkdirSync(fullPath);
            return true;
        } catch(error) {
            //console.error("Could not create the directory", error);
            return false;
        }
    },
    // Restrict exposed functions to accept only strings and return only strings
    serializeArgs: ['string'],
    deserializeReturns: ['string'],
});
