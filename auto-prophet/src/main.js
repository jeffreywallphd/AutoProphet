// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.

const { app, BrowserWindow } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require("fs");
const ipcMain = require('electron').ipcMain;

//ipcMain.on('select-data', async (event, args) => {
//  const data = await selectFromDatabase(args["query"], args["inputData"]);
//  event.sender.send('select-data-response', data);
//});

ipcMain.handle('select-data', async (event, args) => {
  const data = await selectFromDatabase(args["query"], args["inputData"]);
  return data;
});

ipcMain.handle('sqlite-query', async (event, args) => {
  try{
    const db = new sqlite3.Database(args["database"]);
    const data = await db.all(args["query"], args["parameters"]);
    db.close();
    return data;
  } catch(error) {
    console.log(error);
  }
});

ipcMain.handle('sqlite-insert', async (event, args) => {
  try{
    const db = new sqlite3.Database(args["database"]);
    const statement = await db.prepare(args["query"]);
    result = await statement.run(args["parameters"]);
    db.close();
    return result;
  } catch(error) {
    console.log(error);
  }
});

ipcMain.handle('sqlite-update', async (event, args) => {
  try{
    const db = new sqlite3.Database(args["database"]);
    const statement = await db.prepare(args["query"]);
    result = await statement.run(args["parameters"]);
    db.close();
    return result;
  } catch(error) {
    console.log(error);
  }
});

ipcMain.handle('sqlite-delete', async (event, args) => {
  try{
    const db = new sqlite3.Database(args["database"]);
    const statement = await db.prepare(args["query"]);
    result = await statement.run(args["parameters"]);
    db.close();
    return result;
  } catch(error) {
    console.log(error);
  }
});

// TODO: try to remove nodeIntegration, as it may create security vulnerabilities
const createWindow = () => {
  win = new BrowserWindow({ 
    show: false,
    webPreferences: {
      preload: path.join(app.getAppPath(), 'src/preload.js'),
      //contextIsolation: true
      nodeIntegration: true
    } 
  });
  //win.setMenu(null); // this doesn't allow opening developer tools
  win.maximize();
  win.show();

  win.loadFile('./public/index.html');
};

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});

let db;

const initDatabase = async () => {
  try {
    db = new sqlite3.Database('./src/Asset/DB/AutoProphet.db');
    const schema = await fs.promises.readFile('./src/Asset/DB/schema.sql', 'utf-8');
    await db.exec(schema);
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

initDatabase();

const selectFromDatabase = async (query, dataArray) => {
  return new Promise((resolve, reject) => {
    const data = [];

    try {
      //execute the query
      db.all(query, dataArray, (err, rows) => {
        if (err) {
          console.log(err);
          reject(err);
          return;
        }

        // Convert rows to array of objects
        rows.forEach((row) => data.push(row));
        resolve(data);
      });
    } catch (err) {
      console.log(err);
      reject(err);
    } 
  });
};
