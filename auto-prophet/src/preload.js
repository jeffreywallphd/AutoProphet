const path = require('path');
const { contextBridge } = require('electron')
const { promises: fsPromises } = require('fs');
const fs = require('fs');
  
contextBridge.exposeInMainWorld('fsApi', {
    readFile: async (filePath) => {
        try {
            const fullPath = path.join(__dirname, filePath);
            const data = await fsPromises.readFile(fullPath, 'utf-8');
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
    // Restrict exposed functions to accept only strings and return only strings
    serializeArgs: ['string'],
    deserializeReturns: ['string'],
});
