// DOM Elements
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search');
const sortSelect = document.getElementById('sort-select');
const pluginsGrid = document.getElementById('plugins-grid');
const noResults = document.getElementById('no-results');
const tabButtons = document.querySelectorAll('.tab');
const pluginDetailsModal = document.getElementById('plugin-details-modal');
const closeModalBtn = document.getElementById('close-modal');
const settingsModal = document.getElementById('settings-modal');
const closeSettingsModalBtn = document.getElementById('close-settings-modal');
const settingsBtn = document.getElementById('settings-btn');
const backToHomeBtn = document.getElementById('back-to-home-btn');
const backBtn = document.getElementById('back-btn');
const constructPathDisplay = document.getElementById('construct-path-display');
const pluginInstallStatus = document.getElementById('plugin-install-status');

// Plugin Installation
const installPluginBtn = document.getElementById('install-plugin-btn');
const pluginInstalledModal = document.getElementById('plugin-installed-modal');
const closeSuccessModalBtn = document.getElementById('close-success-modal');
const okSuccessBtn = document.getElementById('ok-success-btn');
const successPluginName = document.getElementById('success-plugin-name');

// Window control buttons
document.getElementById('minimize-btn').addEventListener('click', () => {
  window.electronAPI.minimizeWindow();
});

document.getElementById('maximize-btn').addEventListener('click', () => {
  window.electronAPI.maximizeWindow();
});

document.getElementById('close-btn').addEventListener('click', () => {
  window.electronAPI.closeWindow();
});

// Settings button to open settings modal
settingsBtn.addEventListener('click', () => {
  // Show settings modal
  settingsModal.classList.add('active');
});

// Close settings modal
closeSettingsModalBtn.addEventListener('click', () => {
  settingsModal.classList.remove('active');
});

// Back button
backBtn.addEventListener('click', () => {
  window.electronAPI.navigateToHome();
});

// Back to home button
backToHomeBtn.addEventListener('click', () => {
  // Navigate to home
  if (window.electronAPI && window.electronAPI.navigateToHome) {
    window.electronAPI.navigateToHome();
  } else {
    alert('Navigation not available in this demo');
  }
});

// Plugins data
let pluginsData = [];
let currentFilter = 'plugins'; // Default filter is plugins
let currentSort = 'name-asc';
let currentSearch = '';
let selectedPlugin = null;
let constructPath = localStorage.getItem('constructPath') || '';
let isLoading = false;

// Cache for plugin icons
const iconCache = new Map();

// Installed plugins tracking
let installedPlugins = new Set(JSON.parse(localStorage.getItem('installedPlugins') || '[]'));

// Save installed plugins to localStorage
function saveInstalledPlugins() {
  localStorage.setItem('installedPlugins', JSON.stringify([...installedPlugins]));
}

// Initialize
async function init() {
  showLoadingIndicator();
  
  // Load construct path from localStorage if available
  if (constructPath) {
    constructPathDisplay.textContent = constructPath;
    
    // Set the construct path in the main process
    if (window.electronAPI && window.electronAPI.setConstructPath) {
      window.electronAPI.setConstructPath(constructPath);
    }
  }
  
  // Load plugins data
  await loadPlugins();
  
  // Filter plugins by current criteria and render
  filterAndRenderPlugins();
  
  // Set up event listeners
  setupEventListeners();
  
  hideLoadingIndicator();
}

// Create a simple loading indicator
function showLoadingIndicator() {
  isLoading = true;
  
  const loader = document.createElement('div');
  loader.id = 'plugins-loader';
  loader.innerHTML = `
    <div class="plugins-loading">
      <div class="loading-spinner"></div>
      <p>Loading plugins...</p>
    </div>
  `;
  document.body.appendChild(loader);
  
  // Add style if it doesn't exist
  if (!document.getElementById('loader-style')) {
    const style = document.createElement('style');
    style.id = 'loader-style';
    style.textContent = `
      #plugins-loader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(15, 15, 15, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
      }
      .plugins-loading {
        background-color: var(--black-12);
        padding: 30px;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      }
      .loading-spinner {
        display: inline-block;
        width: 40px;
        height: 40px;
        border: 4px solid rgba(229, 0, 0, 0.1);
        border-radius: 50%;
        border-top-color: var(--red-45);
        animation: spin 1s ease-in-out infinite;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
}

function hideLoadingIndicator() {
  isLoading = false;
  
  const loader = document.getElementById('plugins-loader');
  if (loader) {
    loader.style.transition = 'opacity 0.3s';
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.remove();
    }, 300);
  }
}

// Load plugins from the plugins.json file (only once)
async function loadPlugins() {
  // If plugins are already loaded, don't reload
  if (pluginsData.length > 0) {
    return pluginsData;
  }
  
  try {
    if (window.electronAPI && window.electronAPI.getPlugins) {
      const plugins = await window.electronAPI.getPlugins();
      
      if (Array.isArray(plugins) && plugins.length > 0) {
        pluginsData = plugins;
      } else {
        console.warn('No plugins returned or invalid data format, falling back to sample data');
        pluginsData = getSamplePlugins();
      }
    } else {
      // Fallback for demo/testing
      console.warn('API not available, using sample data');
      pluginsData = getSamplePlugins();
    }
    
    // Pre-sort plugins by name for faster initial rendering
    pluginsData.sort((a, b) => a.name.localeCompare(b.name));
    
    return pluginsData;
  } catch (error) {
    console.error('Failed to load plugins:', error);
    pluginsData = getSamplePlugins();
    return pluginsData;
  }
}

// Get plugin icon with caching
async function getPluginIcon(pluginPath) {
  // Check cache first
  if (iconCache.has(pluginPath)) {
    return iconCache.get(pluginPath);
  }
  
  try {
    if (window.electronAPI && window.electronAPI.getPluginIcon) {
      const result = await window.electronAPI.getPluginIcon(pluginPath);
      
      if (result.success) {
        // Cache the icon
        iconCache.set(pluginPath, result.iconData);
        return result.iconData;
      }
    }
  } catch (error) {
    console.error('Failed to get plugin icon:', error);
  }
  
  // Return default plugin icon (null)
  return null;
}

// Setup event listeners with debouncing for search
function setupEventListeners() {
  // Search input with debounce
  let searchTimeout;
  searchInput.addEventListener('input', () => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    searchTimeout = setTimeout(() => {
      currentSearch = searchInput.value.trim();
      filterAndRenderPlugins();
      
      // Show/hide clear button
      if (currentSearch) {
        clearSearchBtn.classList.add('visible');
      } else {
        clearSearchBtn.classList.remove('visible');
      }
    }, 300); // 300ms debounce
  });
  
  // Clear search button
  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    currentSearch = '';
    filterAndRenderPlugins();
    clearSearchBtn.classList.remove('visible');
  });
  
  // Sort select
  sortSelect.addEventListener('change', () => {
    currentSort = sortSelect.value;
    filterAndRenderPlugins();
  });
  
  // Tab buttons
  tabButtons.forEach(tab => {
    tab.addEventListener('click', () => {
      // Skip if tab is disabled
      if (tab.classList.contains('disabled')) {
        return;
      }
      
      // Update active state
      tabButtons.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Update filter
      currentFilter = tab.dataset.tab;
      filterAndRenderPlugins();
    });
  });
  
  // Modal close button
  closeModalBtn.addEventListener('click', closePluginDetails);
  
  // Close modal when clicking outside of it
  pluginDetailsModal.addEventListener('click', (e) => {
    if (e.target === pluginDetailsModal) {
      closePluginDetails();
    }
  });
  
  // Install plugin button
  installPluginBtn.addEventListener('click', installSelectedPlugin);
  
  // Success modal buttons
  closeSuccessModalBtn.addEventListener('click', () => {
    pluginInstalledModal.classList.remove('active');
  });
  
  okSuccessBtn.addEventListener('click', () => {
    pluginInstalledModal.classList.remove('active');
  });
  
  // Escape key to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (pluginDetailsModal.classList.contains('active')) {
        closePluginDetails();
      }
      if (pluginInstalledModal.classList.contains('active')) {
        pluginInstalledModal.classList.remove('active');
      }
      if (settingsModal.classList.contains('active')) {
        settingsModal.classList.remove('active');
      }
    }
  });
  
  // Ctrl+F to focus search
  document.addEventListener('keydown', (e) => {
    if (e.key === 'f' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      searchInput.focus();
    }
  });
}

// Filter and render plugins in one step
function filterAndRenderPlugins() {
  // Start with all plugins
  let filtered = [...pluginsData];
  
  // Apply search filter
  if (currentSearch) {
    const searchLower = currentSearch.toLowerCase();
    filtered = filtered.filter(plugin => 
      plugin.name.toLowerCase().includes(searchLower) || 
      (plugin.description && plugin.description.toLowerCase().includes(searchLower)) ||
      (plugin.author && plugin.author.toLowerCase().includes(searchLower))
    );
  }
  
  // Apply sorting
  switch (currentSort) {
    case 'name-asc':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      filtered.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'author':
      filtered.sort((a, b) => (a.author || '').localeCompare(b.author || ''));
      break;
    case 'version':
      filtered.sort((a, b) => (a.version || '').localeCompare(b.version || ''));
      break;
  }
  
  // Show/hide no results message
  if (filtered.length === 0) {
    noResults.classList.remove('hidden');
  } else {
    noResults.classList.add('hidden');
  }
  
  // Use document fragment for better performance
  const fragment = document.createDocumentFragment();
  
  // Render plugins all at once using the fragment
  filtered.forEach(plugin => {
    const card = createPluginCard(plugin);
    fragment.appendChild(card);
  });
  
  // Clear the grid
  pluginsGrid.innerHTML = '';
  
  // Add all cards at once
  pluginsGrid.appendChild(fragment);
}

// Check if a plugin is installed
function isPluginInstalled(plugin) {
  return installedPlugins.has(plugin.path);
}

// Create a plugin card (simplified)
function createPluginCard(plugin) {
  const card = document.createElement('div');
  card.className = 'plugin-card';
  
  // Add installed class if plugin is installed
  if (isPluginInstalled(plugin)) {
    card.classList.add('installed');
  }
  
  // Get plugin icon url from cache (if available)
  let iconUrl = iconCache.get(plugin.path);
  
  // Use icon or default emoji
  let iconHTML = iconUrl 
    ? `<div class="plugin-icon"><img src="${iconUrl}" alt="${plugin.name}" class="plugin-icon-img"></div>`
    : '<div class="plugin-icon">🔌</div>';
  
  card.innerHTML = `
    <div class="plugin-header"></div>
    <div class="plugin-content">
      ${iconHTML}
      <h3 class="plugin-name">${plugin.name}</h3>
      <div class="plugin-author">${plugin.author || 'Unknown Author'}</div>
    </div>
  `;
  
  // Add click event to open the modal
  card.addEventListener('click', () => openPluginDetails(plugin));
  
  // If icon is not cached, load it in the background
  if (!iconUrl && plugin.path) {
    getPluginIcon(plugin.path).then(url => {
      if (url) {
        // Update the icon in this card
        const iconContainer = card.querySelector('.plugin-icon');
        if (iconContainer) {
          iconContainer.innerHTML = `<img src="${url}" alt="${plugin.name}" class="plugin-icon-img">`;
        }
      }
    }).catch(() => {
      // Ignore errors, keep the default icon
    });
  }
  
  return card;
}

// Open plugin details modal
async function openPluginDetails(plugin) {
  // Set selected plugin
  selectedPlugin = plugin;
  
  // Try to get the plugin icon
  let iconHTML = '🔌';
  
  if (plugin.path) {
    const iconUrl = iconCache.get(plugin.path) || await getPluginIcon(plugin.path);
    if (iconUrl) {
      iconHTML = `<img src="${iconUrl}" alt="${plugin.name}" class="modal-plugin-icon-img">`;
    }
  }
  
  // Check if plugin is installed
  const installed = isPluginInstalled(plugin);
  
  // Set modal content
  document.getElementById('modal-plugin-name').textContent = plugin.name;
  document.getElementById('modal-plugin-icon').innerHTML = iconHTML;
  document.getElementById('modal-plugin-version').textContent = plugin.version || 'Unknown';
  document.getElementById('modal-plugin-author').textContent = plugin.author || 'Unknown Author';
  document.getElementById('modal-plugin-description').textContent = plugin.description || 'No description available';
  
  // Set installation status
  pluginInstallStatus.textContent = installed ? 'Installed' : 'Not installed';
  pluginInstallStatus.className = installed ? 'installed' : 'not-installed';
  
  // Update install button
  installPluginBtn.textContent = installed ? 'Reinstall Plugin' : 'Install Plugin';
  installPluginBtn.className = installed ? 'btn primary-btn reinstall' : 'btn primary-btn';
  
  // Enable/disable install button based on construct path
  installPluginBtn.disabled = !constructPath;
  if (!constructPath) {
    installPluginBtn.title = 'Construct 2 path not set. Please set the path in Settings.';
  } else {
    installPluginBtn.title = installed ? 'Reinstall this plugin' : 'Install this plugin';
  }
  
  // Show modal
  pluginDetailsModal.classList.add('active');
}

// Close plugin details modal
function closePluginDetails() {
  pluginDetailsModal.classList.remove('active');
  selectedPlugin = null;
}

// Install the selected plugin
async function installSelectedPlugin() {
  if (!selectedPlugin || !constructPath) {
    alert('Please select a plugin and set the Construct 2 path first');
    return;
  }
  
  try {
    // Show loading state
    installPluginBtn.disabled = true;
    installPluginBtn.textContent = 'Installing...';
    
    // Call the install plugin function
    if (window.electronAPI && window.electronAPI.installPlugin) {
      const result = await window.electronAPI.installPlugin(selectedPlugin);
      
      if (result.success) {
        // Mark plugin as installed
        installedPlugins.add(selectedPlugin.path);
        saveInstalledPlugins();
        
        // Show success message
        showSuccessMessage(selectedPlugin.name);
        
        // Update UI
        filterAndRenderPlugins();
      } else {
        alert(`Installation failed: ${result.error}`);
      }
    } else {
      // Fallback for demo/testing
      console.warn('API not available, simulating installation');
      
      // Simulate installation delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mark plugin as installed
      installedPlugins.add(selectedPlugin.path);
      saveInstalledPlugins();
      
      // Show success message
      showSuccessMessage(selectedPlugin.name);
      
      // Update UI
      filterAndRenderPlugins();
    }
  } catch (error) {
    console.error('Failed to install plugin:', error);
    alert(`Installation failed: ${error.message}`);
  } finally {
    // Reset button state
    installPluginBtn.disabled = false;
    installPluginBtn.textContent = isPluginInstalled(selectedPlugin) ? 'Reinstall Plugin' : 'Install Plugin';
    
    // Close the details modal
    closePluginDetails();
  }
}

// Show success message
function showSuccessMessage(pluginName) {
  // Set the plugin name in the success modal
  successPluginName.textContent = pluginName;
  
  // Show the success modal
  pluginInstalledModal.classList.add('active');
}

// Get sample plugins data for demo/testing
function getSamplePlugins() {
  return [
    {
      "name": "Multiline box",
      "description": "A multiline text field for the user to enter text in to.",
      "version": "1.14",
      "author": "Gregory Georges",
      "path": "plugins/7_MultilineBox"
    },
    {
      "name": "Sprite",
      "description": "An animating object with image frames that can be positioned and sized.",
      "version": "2.0.1",
      "author": "Scirra",
      "path": "plugins/sprite"
    },
    {
      "name": "Text Input",
      "description": "A text input object that allows users to type in text.",
      "version": "1.5.3",
      "author": "Scirra",
      "path": "plugins/text_input"
    },
    {
      "name": "Button",
      "description": "A clickable button object with various states and appearance options.",
      "version": "1.7.2",
      "author": "Scirra",
      "path": "plugins/button"
    },
    {
      "name": "Audio",
      "description": "Play audio files, including background music and sound effects.",
      "version": "1.8.2",
      "author": "Scirra",
      "path": "plugins/audio"
    },
    {
      "name": "9-Patch",
      "description": "Create resizable UI elements that maintain their border appearance.",
      "version": "1.3.0",
      "author": "Scirra",
      "path": "plugins/9patch"
    }
  ];
}

// Start the application
document.addEventListener('DOMContentLoaded', init);