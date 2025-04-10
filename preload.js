const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'api', {
    selectFolder: () => ipcRenderer.invoke('select-folder'),
    onNotAdmin: (callback) => {
      const subscription = (_event) => callback();
      ipcRenderer.on('not-admin', subscription);
      
      return () => {
        ipcRenderer.removeListener('not-admin', subscription);
      };
    },
    restartAsAdmin: () => ipcRenderer.send('restart-as-admin'),
    minimizeWindow: () => ipcRenderer.send('minimize-window'),
    maximizeWindow: () => ipcRenderer.send('maximize-window'),
    closeWindow: () => ipcRenderer.send('close-window')
  }
);