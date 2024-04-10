const path = require('path');
const { contextBridge } = require('electron')
const { promises: fsPromises } = require('fs');
const fs = require('fs');
  
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: require('electron').ipcRenderer,
});

contextBridge.exposeInMainWorld('fs', {
    fs: require('fs'),
});

contextBridge.exposeInMainWorld('yahoo', {
    finance: require('yahoo-finance2').default
});

// for databases that rely on require(), add them to this contextBridge
contextBridge.exposeInMainWorld('database', {
    sqlite: require('sqlite3').verbose()
});

// use window.console.log when you need to log within electron
/*contextBridge.exposeInMainWorld('terminal', {
    log: (data) => {
        console.log(data);
    },
    error: (data) => {
        console.error(data);
    }
});*/