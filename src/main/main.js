const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const isAdmin = require('is-admin');

let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    minWidth: 800,
    minHeight: 500,
    frame: false, // Frameless window
    backgroundColor: '#0F0F0F', // Black 06 from guideline
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload/preload.js')
    }
  });

  // Load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '../renderer/views/index.html'));

  // Check if running as admin
  checkAdminStatus();
}

async function checkAdminStatus() {
  try {
    const admin = await isAdmin();
    if (!admin) {
      // Send a message to the renderer if not running as admin
      mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('not-admin');
      });
    }
  } catch (error) {
    console.error('Failed to check admin status:', error);
  }
}

// Create window when app is ready
app.whenReady().then(() => {
  createWindow();
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Listen for select folder event
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  return result.filePaths;
});

ipcMain.on('navigate-to-items', () => {
  mainWindow.loadFile(path.join(__dirname, '../renderer/views/items.html'));
});

// Listen for navigate to home event
ipcMain.on('navigate-to-home', () => {
  mainWindow.loadFile(path.join(__dirname, '../renderer/views/index.html'));
});

// Validate Construct 2 path
ipcMain.handle('validate-construct-path', async (event, folderPath) => {
  try {
    // Check if paths exist
    const validationResults = {
      behaviors: false,
      plugins: false,
      effects: false,
      executable: false,
      isValid: false,
      error: null
    };

    // Check behaviors folder
    const behaviorsPath = path.join(folderPath, 'exporters', 'html5', 'behaviors');
    validationResults.behaviors = fs.existsSync(behaviorsPath);

    // Check plugins folder
    const pluginsPath = path.join(folderPath, 'exporters', 'html5', 'plugins');
    validationResults.plugins = fs.existsSync(pluginsPath);

    // Check effects folder
    const effectsPath = path.join(folderPath, 'effects');
    validationResults.effects = fs.existsSync(effectsPath);

    // Check executable
    const executablePath = path.join(folderPath, 'Construct2.exe');
    validationResults.executable = fs.existsSync(executablePath);

    // Path is valid if all checks pass
    validationResults.isValid = 
      validationResults.behaviors && 
      validationResults.plugins && 
      validationResults.effects && 
      validationResults.executable;

    return validationResults;
  } catch (error) {
    console.error('Path validation error:', error);
    return {
      behaviors: false,
      plugins: false,
      effects: false,
      executable: false,
      isValid: false,
      error: error.message
    };
  }
});

// Listen for restart as admin request
ipcMain.on('restart-as-admin', () => {
  // This is a simplified version. In a real app, you'd need 
  // platform-specific code to restart with admin privileges
  app.quit();
});

// Window control handlers
ipcMain.on('minimize-window', () => {
  mainWindow.minimize();
});

ipcMain.on('maximize-window', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.on('close-window', () => {
  mainWindow.close();
});