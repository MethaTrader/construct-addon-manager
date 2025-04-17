const { app, BrowserWindow, dialog, ipcMain, globalShortcut } = require('electron');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const isAdmin = require('is-admin');

let mainWindow;
let constructPath = ''; // Store construct path

// Path to plugins.json file in the root directory
const pluginsJsonPath = path.join(app.getAppPath(), 'plugins.json');
let pluginsData = [];

// Resource database path (in a real app, this would be in the app's data directory)
const resourcesDatabasePath = path.join(app.getPath('userData'), 'resources-database.json');
let resourcesDatabase = [];

// Load resources database on startup
async function loadResourcesDatabase() {
  try {
    const data = await fsPromises.readFile(resourcesDatabasePath, 'utf8');
    resourcesDatabase = JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is invalid, start with empty database
    resourcesDatabase = [];
    // Create file
    await saveResourcesDatabase();
  }
}

// Save resources database
async function saveResourcesDatabase() {
  try {
    await fsPromises.writeFile(resourcesDatabasePath, JSON.stringify(resourcesDatabase, null, 2), 'utf8');
  } catch (error) {
    console.error('Failed to save resources database:', error);
  }
}

// Load plugins data from plugins.json
// Enhanced loadPluginsData function with better error handling and debugging
async function loadPluginsData() {
  const pluginsJsonPath = getPluginsJsonPath();
  
  try {
    // Check if file exists first
    if (!fs.existsSync(pluginsJsonPath)) {
      console.error(`plugins.json file not found at path: ${pluginsJsonPath}`);
      // Create an empty plugins.json file if it doesn't exist
      await fsPromises.writeFile(pluginsJsonPath, JSON.stringify([
        {
          "name": "Sample Plugin",
          "description": "This is a sample plugin entry. Replace with your actual plugins.",
          "version": "1.0.0",
          "author": "You",
          "path": "plugins/sample"
        }
      ], null, 2));
      console.log('Created a sample plugins.json file');
    }
    
    // Now read the file
    const data = await fsPromises.readFile(pluginsJsonPath, 'utf8');
    console.log('Raw plugins data:', data.substring(0, 200) + (data.length > 200 ? '...' : ''));
    
    try {
      pluginsData = JSON.parse(data);
      console.log(`Loaded ${pluginsData.length} plugins from ${pluginsJsonPath}`);
      
      // Verify the plugins directory exists
      for (const plugin of pluginsData) {
        const pluginPath = path.join(getAppPath(), plugin.path);
        const exists = fs.existsSync(pluginPath);
        console.log(`Plugin path check: ${pluginPath} - ${exists ? 'Exists' : 'Not found'}`);
      }
      
      return pluginsData;
    } catch (parseError) {
      console.error('Error parsing plugins.json:', parseError);
      return [];
    }
  } catch (error) {
    console.error('Failed to load plugins data:', error);
    return [];
  }
}

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
      preload: path.join(__dirname, '../preload/preload.js'),
      devTools: true // Enable DevTools
    }
  });

  // Load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '../renderer/views/index.html'));

  // Open DevTools in development mode
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Register F12 shortcut to toggle DevTools
  globalShortcut.register('F12', () => {
    mainWindow.webContents.toggleDevTools();
  });

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
app.whenReady().then(async () => {
  createWindow();
  await loadResourcesDatabase();
  await loadPluginsData(); // Load plugins when app starts
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Set Construct 2 path
ipcMain.on('set-construct-path', (event, path) => {
  constructPath = path;
  console.log('Construct 2 path set to:', constructPath);
});

// Update the get-plugins handler to provide more information on failure
ipcMain.handle('get-plugins', async () => {
  try {
    if (pluginsData.length === 0) {
      console.log('Loading plugins data as none is cached');
      const loadedPlugins = await loadPluginsData();
      if (loadedPlugins.length === 0) {
        console.warn('No plugins loaded - returning sample plugins');
        // Return sample data as fallback
        return [
          {
            "name": "Sample Plugin",
            "description": "Sample plugin for testing.",
            "version": "1.0.0",
            "author": "Construct Addon Manager",
            "path": "plugins/sample"
          }
        ];
      }
      return loadedPlugins;
    }
    return pluginsData;
  } catch (error) {
    console.error('Error in get-plugins handler:', error);
    // Return sample data as fallback
    return [
      {
        "name": "Error Plugin",
        "description": "There was an error loading plugins. Check the console for details.",
        "version": "1.0.0",
        "author": "Construct Addon Manager",
        "path": "plugins/error"
      }
    ];
  }
});

// Install plugin
ipcMain.handle('install-plugin', async (event, pluginInfo) => {
  try {
    if (!constructPath) {
      throw new Error('Construct 2 path is not set');
    }

    // Source path (plugin folder in the app)
    const sourcePath = path.join(app.getAppPath(), pluginInfo.path);
    
    // Destination path (Construct 2 plugins directory)
    const destPath = path.join(constructPath, 'exporters', 'html5', 'plugins', path.basename(pluginInfo.path));
    
    console.log(`Installing plugin from ${sourcePath} to ${destPath}`);
    
    // Check if source exists
    if (!fs.existsSync(sourcePath)) {
      throw new Error(`Plugin source not found: ${sourcePath}`);
    }
    
    // Ensure directory exists
    await fsPromises.mkdir(path.dirname(destPath), { recursive: true });
    
    // Copy plugin files to destination
    await copyDirectory(sourcePath, destPath);
    
    return { success: true, message: `Plugin "${pluginInfo.name}" installed successfully` };
  } catch (error) {
    console.error('Failed to install plugin:', error);
    return { success: false, error: error.message };
  }
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

// Listen for open external link event
ipcMain.on('open-external-link', (event, url) => {
  require('electron').shell.openExternal(url);
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

// Helper function to copy a directory
async function copyDirectory(src, dest) {
  // Create destination directory
  await fsPromises.mkdir(dest, { recursive: true });
  
  // Read source directory
  const entries = await fsPromises.readdir(src, { withFileTypes: true });
  
  // Process each entry
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      // Recursively copy subdirectory
      await copyDirectory(srcPath, destPath);
    } else {
      // Copy file
      await fsPromises.copyFile(srcPath, destPath);
    }
  }
}

// Get resources
ipcMain.handle('get-resources', async () => {
  return resourcesDatabase;
});

// Clean up shortcuts when app is quitting
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// Add this function to src/main/main.js

// Get plugin icon as base64
ipcMain.handle('get-plugin-icon', async (event, pluginPath) => {
  try {
    const iconPath = path.join(app.getAppPath(), pluginPath, 'PluginIcon.ico');
    
    // Check if icon exists
    if (fs.existsSync(iconPath)) {
      // Read the icon file
      const iconData = await fsPromises.readFile(iconPath);
      
      // Convert to base64
      const base64Icon = `data:image/x-icon;base64,${iconData.toString('base64')}`;
      return { success: true, iconData: base64Icon };
    } else {
      // Return default icon indicator
      return { success: false, error: 'Icon not found' };
    }
  } catch (error) {
    console.error('Error reading plugin icon:', error);
    return { success: false, error: error.message };
  }
});


function getAppPath() {
  let appPath;
  // In production, use the resources path for the extra resources
  if (app.isPackaged) {
    appPath = path.join(process.resourcesPath);
  } else {
    // In development, use the application path
    appPath = app.getAppPath();
  }
  console.log('Application path:', appPath);
  return appPath;
}

// Improved plugins.json path with logging
function getPluginsJsonPath() {
  const jsonPath = path.join(getAppPath(), 'plugins.json');
  console.log('Plugins JSON path:', jsonPath);
  return jsonPath;
}