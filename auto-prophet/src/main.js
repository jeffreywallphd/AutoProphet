// No Warranty
// This software is provided "as is" without any warranty of any kind, express or implied. This includes, but is not limited to, the warranties of merchantability, fitness for a particular purpose, and non-infringement.
//
// Disclaimer of Liability
// The authors of this software disclaim all liability for any damages, including incidental, consequential, special, or indirect damages, arising from the use or inability to use this software.

const { app, BrowserWindow } = require('electron');
const path = require('path');

const createWindow = () => {
  win = new BrowserWindow({ 
    show: false,
    webPreferences: {
      preload: path.join(app.getAppPath(), 'src/preload.js'),
      nodeIntegration: true
    } 
  });
  //win.setMenu(null);
  win.maximize();
  win.show();

  win.loadFile('./public/index.html');
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

