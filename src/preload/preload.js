const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'api', {
    selectFolder: () => ipcRenderer.invoke('select-folder'),
    validateConstructPath: (path) => ipcRenderer.invoke('validate-construct-path', path),
    onNotAdmin: (callback) => {
      const subscription = (_event) => callback();
      ipcRenderer.on('not-admin', subscription);
      
      return () => {
        ipcRenderer.removeListener('not-admin', subscription);
      };
    },

    // Resource Management APIs
    createResourceDirectories: () => ipcRenderer.invoke('create-resource-directories'),
    checkResourceExists: (type, id) => ipcRenderer.invoke('check-resource-exists', type, id),
    copyResourceFiles: (sourcePath, type, id) => 
      ipcRenderer.invoke('copy-resource-files', sourcePath, type, id),
    saveResourceMetadata: (resourceData) => 
      ipcRenderer.invoke('save-resource-metadata', resourceData),
    getAllResources: () => ipcRenderer.invoke('get-all-resources'),

    restartAsAdmin: () => ipcRenderer.send('restart-as-admin'),
    minimizeWindow: () => ipcRenderer.send('minimize-window'),
    maximizeWindow: () => ipcRenderer.send('maximize-window'),
    closeWindow: () => ipcRenderer.send('close-window'),
    navigateToItems: () => ipcRenderer.send('navigate-to-items'),
    navigateToHome: () => ipcRenderer.send('navigate-to-home'),
    openExternalLink: (url) => ipcRenderer.send('open-external-link', url),
    getResources: () => ipcRenderer.invoke('get-resources'),
    parseResourceMetadata: (folderPath, resourceType) => ipcRenderer.invoke('parse-resource-metadata', folderPath, resourceType),
    addResource: (resourcePath, resourceType, overwrite) => ipcRenderer.invoke('add-resource', resourcePath, resourceType, overwrite),
    onResourcesUpdated: (callback) => {
      const subscription = (_event, resources) => callback(resources);
      ipcRenderer.on('resources-updated', subscription);
      
      return () => {
        ipcRenderer.removeListener('resources-updated', subscription);
      };
    }
  }
);