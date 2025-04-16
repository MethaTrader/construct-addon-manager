const { app, BrowserWindow, dialog, ipcMain, globalShortcut } = require('electron');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const isAdmin = require('is-admin');

let mainWindow;

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

// Handle resource metadata parsing
ipcMain.handle('parse-resource-metadata', async (event, folderPath, resourceType) => {
  try {
    // Check if folder exists
    const stats = await fsPromises.stat(folderPath);
    if (!stats.isDirectory()) {
      return { isValid: false, error: 'Selected path is not a directory' };
    }

    // Find and parse edittime.js
    const edittimePath = path.join(folderPath, 'edittime.js');
    try {
      await fsPromises.access(edittimePath);
    } catch (error) {
      return { isValid: false, error: 'Missing edittime.js file' };
    }

    // Read edittime.js content
    const edittimeContent = await fsPromises.readFile(edittimePath, 'utf8');
    
    // Extract metadata based on resource type
    let metadata;
    if (resourceType === 'plugin') {
      metadata = extractPluginMetadata(edittimeContent);
    } else if (resourceType === 'behavior') {
      metadata = extractBehaviorMetadata(edittimeContent);
    } else {
      return { isValid: false, error: 'Unsupported resource type' };
    }
    
    if (!metadata) {
      return { isValid: false, error: `Could not find ${resourceType} settings in edittime.js` };
    }
    
    // Check for icon file
    const iconPath = path.join(folderPath, 'PluginIcon.ico');
    try {
      await fsPromises.access(iconPath);
      // Convert icon path to a data URL for the renderer
      metadata.iconPath = `file://${iconPath}`;
    } catch (error) {
      // Icon is optional
      metadata.iconPath = null;
    }
    
    // Check for common.js (required)
    const commonPath = path.join(folderPath, 'common.js');
    try {
      await fsPromises.access(commonPath);
    } catch (error) {
      return { isValid: false, error: 'Missing common.js file' };
    }
    
    // Mark as valid
    metadata.isValid = true;
    metadata.folderPath = folderPath;
    
    return metadata;
  } catch (error) {
    console.error('Error parsing resource metadata:', error);
    return { isValid: false, error: error.message };
  }
});

// Extract plugin metadata from edittime.js
function extractPluginMetadata(content) {
  // Look for GetPluginSettings function
  const pluginSettingsRegex = /function\s+GetPluginSettings\s*\(\s*\)\s*\{[\s\S]*?return\s*\{([\s\S]*?)\}\s*;?\s*\}/i;
  const match = content.match(pluginSettingsRegex);
  
  if (!match || !match[1]) return null;
  
  // Extract properties from the match
  const propertiesStr = match[1];
  
  const nameMatch = propertiesStr.match(/"name"\s*:\s*"([^"]+)"/);
  const idMatch = propertiesStr.match(/"id"\s*:\s*"([^"]+)"/);
  const versionMatch = propertiesStr.match(/"version"\s*:\s*"([^"]+)"/);
  const descriptionMatch = propertiesStr.match(/"description"\s*:\s*"([^"]+)"/);
  const authorMatch = propertiesStr.match(/"author"\s*:\s*"([^"]+)"/);
  const helpUrlMatch = propertiesStr.match(/"help url"\s*:\s*"([^"]+)"/);
  const categoryMatch = propertiesStr.match(/"category"\s*:\s*"([^"]+)"/);
  
  return {
    name: nameMatch ? nameMatch[1] : undefined,
    id: idMatch ? idMatch[1] : undefined,
    version: versionMatch ? versionMatch[1] : undefined,
    description: descriptionMatch ? descriptionMatch[1] : undefined,
    author: authorMatch ? authorMatch[1] : undefined,
    helpUrl: helpUrlMatch ? helpUrlMatch[1] : undefined,
    category: categoryMatch ? categoryMatch[1] : undefined
  };
}

// Extract behavior metadata from edittime.js
function extractBehaviorMetadata(content) {
  // Look for GetBehaviorSettings function
  const behaviorSettingsRegex = /function\s+GetBehaviorSettings\s*\(\s*\)\s*\{[\s\S]*?return\s*\{([\s\S]*?)\}\s*;?\s*\}/i;
  const match = content.match(behaviorSettingsRegex);
  
  if (!match || !match[1]) return null;
  
  // Extract properties from the match
  const propertiesStr = match[1];
  
  const nameMatch = propertiesStr.match(/"name"\s*:\s*"([^"]+)"/);
  const idMatch = propertiesStr.match(/"id"\s*:\s*"([^"]+)"/);
  const versionMatch = propertiesStr.match(/"version"\s*:\s*"([^"]+)"/);
  const descriptionMatch = propertiesStr.match(/"description"\s*:\s*"([^"]+)"/);
  const authorMatch = propertiesStr.match(/"author"\s*:\s*"([^"]+)"/);
  const helpUrlMatch = propertiesStr.match(/"help url"\s*:\s*"([^"]+)"/);
  const categoryMatch = propertiesStr.match(/"category"\s*:\s*"([^"]+)"/);
  
  return {
    name: nameMatch ? nameMatch[1] : undefined,
    id: idMatch ? idMatch[1] : undefined,
    version: versionMatch ? versionMatch[1] : undefined,
    description: descriptionMatch ? descriptionMatch[1] : undefined,
    author: authorMatch ? authorMatch[1] : undefined,
    helpUrl: helpUrlMatch ? helpUrlMatch[1] : undefined,
    category: categoryMatch ? categoryMatch[1] : undefined
  };
}

// Handle adding resources
ipcMain.handle('add-resource', async (event, resourcePath, resourceType, overwrite = false) => {
  try {
    // Parse resource metadata again
    const metadata = await parseResourceMetadata(resourcePath, resourceType);
    
    if (!metadata || !metadata.isValid) {
      throw new Error('Invalid resource metadata');
    }
    
    // Check if resource exists
    const existingResourceIndex = resourcesDatabase.findIndex(r => 
      r.id === metadata.id && r.type === resourceType
    );
    
    if (existingResourceIndex !== -1 && !overwrite) {
      throw new Error('Resource already exists');
    }
    
    // Resource destination path (in a real app, this would be in Construct's directories)
    // For demo, we'll use a subdirectory of app data
    const resourcesDir = path.join(app.getPath('userData'), 'resources', resourceType + 's');
    const destPath = path.join(resourcesDir, path.basename(resourcePath));
    
    // Ensure directory exists
    await fsPromises.mkdir(resourcesDir, { recursive: true });
    
    // If overwriting, remove existing directory
    if (existingResourceIndex !== -1) {
      try {
        await fsPromises.rm(destPath, { recursive: true, force: true });
        
        // Remove from database
        resourcesDatabase.splice(existingResourceIndex, 1);
      } catch (error) {
        console.error('Failed to remove existing resource:', error);
      }
    }
    
    // Copy resource files to destination
    await copyDirectory(resourcePath, destPath);
    
    // Add to database
    const resourceEntry = {
      ...metadata,
      type: resourceType,
      path: destPath,
      dateAdded: new Date().toISOString()
    };
    
    // Remove unnecessary fields
    delete resourceEntry.isValid;
    delete resourceEntry.folderPath;
    delete resourceEntry.iconPath;
    
    resourcesDatabase.push(resourceEntry);
    
    // Save database
    await saveResourcesDatabase();
    
    // Send updated resources to renderer
    event.sender.send('resources-updated', resourcesDatabase);
    
    return { success: true };
  } catch (error) {
    console.error('Error adding resource:', error);
    return { success: false, error: error.message };
  }
});

// Get resources
ipcMain.handle('get-resources', async () => {
  return resourcesDatabase;
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

// Clean up shortcuts when app is quitting
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});


// Base paths
const getResourceBasePath = () => {
  return path.join(app.getAppPath(), 'resources');
};

// Create directories for resource types
const createResourceDirectoriesStructure = async () => {
  const basePath = getResourceBasePath();
  
  try {
    // Create base resources directory if it doesn't exist
    await fs.ensureDir(basePath);
    
    // Create subdirectories for each resource type
    await fs.ensureDir(path.join(basePath, 'plugins'));
    await fs.ensureDir(path.join(basePath, 'behaviors'));
    await fs.ensureDir(path.join(basePath, 'effects'));
    
    return true;
  } catch (error) {
    console.error('Error creating resource directories:', error);
    throw error;
  }
};

// Get path for specific resource type
const getResourceTypePath = (type) => {
  const basePath = getResourceBasePath();
  
  switch (type) {
    case 'plugin':
      return path.join(basePath, 'plugins');
    case 'behavior':
      return path.join(basePath, 'behaviors');
    case 'effect':
      return path.join(basePath, 'effects');
    default:
      throw new Error(`Unknown resource type: ${type}`);
  }
};

// Get path for specific resource
const getResourcePath = (type, id) => {
  const typePath = getResourceTypePath(type);
  return path.join(typePath, id);
};

// Add these IPC handlers
ipcMain.handle('create-resource-directories', async () => {
  return await createResourceDirectoriesStructure();
});

ipcMain.handle('check-resource-exists', async (event, type, id) => {
  try {
    const resourcePath = getResourcePath(type, id);
    return await fs.pathExists(resourcePath);
  } catch (error) {
    console.error('Error checking if resource exists:', error);
    throw error;
  }
});

ipcMain.handle('copy-resource-files', async (event, sourcePath, type, id) => {
  try {
    // Get destination path
    const destPath = getResourcePath(type, id);
    
    // Check if source path exists
    if (!(await fs.pathExists(sourcePath))) {
      throw new Error(`Source path does not exist: ${sourcePath}`);
    }
    
    // Create resource directories if they don't exist
    await createResourceDirectoriesStructure();
    
    // Copy files
    await fs.copy(sourcePath, destPath, {
      overwrite: true,
      errorOnExist: false
    });
    
    return true;
  } catch (error) {
    console.error('Error copying resource files:', error);
    throw error;
  }
});

ipcMain.handle('save-resource-metadata', async (event, resourceData) => {
  try {
    const { type, id, name, version, author, category, description, icon } = resourceData;
    
    // Create metadata object
    const metadata = {
      id,
      name,
      version,
      author,
      category,
      description,
      icon,
      type,
      dateAdded: new Date().toISOString()
    };
    
    // Get resource path
    const resourcePath = getResourcePath(type, id);
    
    // Create metadata file path
    const metadataPath = path.join(resourcePath, 'metadata.json');
    
    // Write metadata to file
    await fs.writeJson(metadataPath, metadata, { spaces: 2 });
    
    return true;
  } catch (error) {
    console.error('Error saving resource metadata:', error);
    throw error;
  }
});

ipcMain.handle('get-all-resources', async () => {
  try {
    const resources = [];
    
    // Get resources for each type
    const types = ['plugin', 'behavior', 'effect'];
    
    for (const type of types) {
      const typePath = getResourceTypePath(type);
      
      // Check if type directory exists
      if (!(await fs.pathExists(typePath))) {
        continue;
      }
      
      // Get resource directories
      const dirs = await fs.readdir(typePath);
      
      // Get metadata for each resource
      for (const dir of dirs) {
        const resourcePath = path.join(typePath, dir);
        
        // Check if directory
        const stats = await fs.stat(resourcePath);
        if (!stats.isDirectory()) {
          continue;
        }
        
        // Check if metadata exists
        const metadataPath = path.join(resourcePath, 'metadata.json');
        if (!(await fs.pathExists(metadataPath))) {
          continue;
        }
        
        // Read metadata
        const metadata = await fs.readJson(metadataPath);
        resources.push(metadata);
      }
    }
    
    return resources;
  } catch (error) {
    console.error('Error getting all resources:', error);
    throw error;
  }
});