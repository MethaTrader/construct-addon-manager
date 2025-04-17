const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electronAPI', {
    // Folder and path functions
    selectFolder: () => ipcRenderer.invoke('select-folder'),
    validateConstructPath: (path) => ipcRenderer.invoke('validate-construct-path', path),
    setConstructPath: (path) => ipcRenderer.send('set-construct-path', path),
    
    // Admin functions
    onNotAdmin: (callback) => {
      const subscription = (_event) => callback();
      ipcRenderer.on('not-admin', subscription);
      return () => {
        ipcRenderer.removeListener('not-admin', subscription);
      };
    },
    restartAsAdmin: () => ipcRenderer.send('restart-as-admin'),
    
    // Window control functions
    minimizeWindow: () => ipcRenderer.send('minimize-window'),
    maximizeWindow: () => ipcRenderer.send('maximize-window'),
    closeWindow: () => ipcRenderer.send('close-window'),
    
    // Navigation functions
    navigateToItems: () => ipcRenderer.send('navigate-to-items'),
    navigateToHome: () => ipcRenderer.send('navigate-to-home'),
    
    // External links
    openExternalLink: (url) => ipcRenderer.send('open-external-link', url),
    
    // Plugin management functions
    getPlugins: () => ipcRenderer.invoke('get-plugins'),
    getPluginIcon: (pluginPath) => ipcRenderer.invoke('get-plugin-icon', pluginPath),
    installPlugin: (pluginInfo) => ipcRenderer.invoke('install-plugin', pluginInfo)
  }
);