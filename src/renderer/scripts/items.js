// DOM Elements
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search');
const sortSelect = document.getElementById('sort-select');
const itemsGrid = document.querySelector('.items-grid');
const noResults = document.getElementById('no-results');
const sidebarItems = document.querySelectorAll('.sidebar-item');
const itemDetailsModal = document.getElementById('item-details-modal');
const closeModalBtn = document.getElementById('close-modal');
const settingsModal = document.getElementById('settings-modal');
const closeSettingsModalBtn = document.getElementById('close-settings-modal');
const settingsBtn = document.getElementById('settings-btn');
const backToHomeBtn = document.getElementById('back-to-home-btn');
const downloadResourcesToggle = document.getElementById('download-resources-toggle');
const autoUpdateToggle = document.getElementById('auto-update-toggle');
const donateBtn = document.getElementById('donate-btn');

// Add Resource Modal elements
const addResourceModal = document.getElementById('add-resource-modal');
const addResourceBtn = document.getElementById('add-resource-btn-open');
const closeAddResourceModalBtn = document.getElementById('close-add-resource-modal');
const cancelAddResourceBtn = document.getElementById('cancel-add-resource-btn');
const resourceTypeOptions = document.querySelectorAll('.resource-type-option');
const resourcePathInput = document.getElementById('resource-path-input');
const browseResourceBtn = document.getElementById('browse-resource-btn');
const confirmAddResourceBtn = document.getElementById('add-resource-btn');
const resourceErrorContainer = document.getElementById('resource-error');
const errorMessageElement = document.getElementById('error-message');
const resourcePreview = document.getElementById('resource-preview');

// Success and Conflict modals
const resourceAddedModal = document.getElementById('resource-added-modal');
const resourceConflictModal = document.getElementById('resource-conflict-modal');
const closeSuccessModalBtn = document.getElementById('close-success-modal');
const okSuccessBtn = document.getElementById('ok-success-btn');
const closeConflictModalBtn = document.getElementById('close-conflict-modal');
const cancelOverwriteBtn = document.getElementById('cancel-overwrite-btn');
const confirmOverwriteBtn = document.getElementById('confirm-overwrite-btn');
const successResourceName = document.getElementById('success-resource-name');
const conflictResourceName = document.getElementById('conflict-resource-name');

// Window control buttons
document.getElementById('minimize-btn').addEventListener('click', () => {
  window.api.minimizeWindow();
});

document.getElementById('maximize-btn').addEventListener('click', () => {
  window.api.maximizeWindow();
});

document.getElementById('close-btn').addEventListener('click', () => {
  window.api.closeWindow();
});

// Settings button to open settings modal
settingsBtn.addEventListener('click', () => {
  // Show settings modal instead of navigating
  settingsModal.classList.add('active');
});

// Close settings modal
closeSettingsModalBtn.addEventListener('click', () => {
  settingsModal.classList.remove('active');
});

// Back to home button
backToHomeBtn.addEventListener('click', () => {
  // Navigate to home
  if (window.api && window.api.navigateToHome) {
    window.api.navigateToHome();
  } else {
    alert('Navigation not available in this demo');
  }
});

// Donate button
donateBtn.addEventListener('click', () => {
  // Open donation link in default browser
  if (window.api && window.api.openExternalLink) {
    window.api.openExternalLink('https://beemaxstudio.itch.io/construct-addon-manager');
  } else {
    alert('Donation link: https://beemaxstudio.itch.io/construct-addon-manager');
  }
});

// Settings toggles
downloadResourcesToggle.addEventListener('change', () => {
  // In a real app, this would save the setting
  console.log('Download resources locally:', downloadResourcesToggle.checked);
});

autoUpdateToggle.addEventListener('change', () => {
  // In a real app, this would save the setting
  console.log('Auto-update:', autoUpdateToggle.checked);
});

// Sample items data - In a real app, this would come from the main process
const sampleItems = [
  {
    id: 1,
    name: 'Platform Behavior',
    type: 'behavior',
    icon: '🔄',
    version: '1.2.0',
    author: 'Scirra',
    description: 'Adds platform game movement to an object, allowing it to run and jump.'
  },
  {
    id: 2,
    name: 'Sprite',
    type: 'plugin',
    icon: '🔌',
    version: '2.0.1',
    author: 'Scirra',
    description: 'An animating object with image frames that can be positioned and sized.'
  },
  {
    id: 3,
    name: 'Blur Effect',
    type: 'effect',
    icon: '✨',
    version: '1.0.5',
    author: 'Scirra',
    description: 'Applies a Gaussian blur effect to the background.'
  },
  {
    id: 4,
    name: 'Audio Plugin',
    type: 'plugin',
    icon: '🔌',
    version: '1.8.2',
    author: 'Scirra',
    description: 'Play audio files, including background music and sound effects.'
  },
  {
    id: 5,
    name: 'Sine Behavior',
    type: 'behavior',
    icon: '🔄',
    version: '1.1.0',
    author: 'Scirra',
    description: 'Causes an object to move in a sine wave motion pattern.'
  },
  {
    id: 6,
    name: 'Glow Effect',
    type: 'effect',
    icon: '✨',
    version: '1.3.1',
    author: 'Scirra',
    description: 'Adds a colorful glow effect to objects in your game.'
  },
  {
    id: 7,
    name: 'Bullet Behavior',
    type: 'behavior',
    icon: '🔄',
    version: '1.4.3',
    author: 'Scirra',
    description: 'Moves an object in a straight line at a constant speed.'
  },
  {
    id: 8,
    name: 'Text Plugin',
    type: 'plugin',
    icon: '🔌',
    version: '2.1.0',
    author: 'Scirra',
    description: 'Displays text on screen, with many formatting options.'
  },
  {
    id: 9,
    name: 'Sepia Effect',
    type: 'effect',
    icon: '✨',
    version: '1.0.2',
    author: 'Scirra',
    description: 'Applies a sepia tone filter to give objects an aged look.'
  },
  {
    id: 10,
    name: 'Pathfinding Behavior',
    type: 'behavior',
    icon: '🔄',
    version: '1.7.0',
    author: 'Scirra',
    description: 'Allows an object to find the shortest path to a destination.'
  },
  {
    id: 11,
    name: 'Button Plugin',
    type: 'plugin',
    icon: '🔌',
    version: '1.5.4',
    author: 'Scirra',
    description: 'A clickable button object with various states and appearance options.'
  },
  {
    id: 12,
    name: 'Pixelate Effect',
    type: 'effect',
    icon: '✨',
    version: '1.1.1',
    author: 'Scirra',
    description: 'Creates a pixelated look by reducing the resolution of objects.'
  }
];

// Current filter and sort state
let currentFilter = 'all';
let currentSort = 'name-asc';
let currentSearch = '';

// Render items
function renderItems() {
  // Clear the grid
  itemsGrid.innerHTML = '';
  
  // Filter, sort and search items
  let filteredItems = sampleItems;
  
  // Apply category filter
  if (currentFilter !== 'all') {
    filteredItems = filteredItems.filter(item => item.type === currentFilter);
  }
  
  // Apply search
  if (currentSearch) {
    const searchLower = currentSearch.toLowerCase();
    filteredItems = filteredItems.filter(item => 
      item.name.toLowerCase().includes(searchLower) || 
      item.type.toLowerCase().includes(searchLower)
    );
  }
  
  // Apply sorting
  switch (currentSort) {
    case 'name-asc':
      filteredItems.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      filteredItems.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'type':
      filteredItems.sort((a, b) => a.type.localeCompare(b.type));
      break;
    case 'date-added':
      // In a real app, you would sort by date added
      // For this demo, we'll just use the id as a proxy for date
      filteredItems.sort((a, b) => b.id - a.id);
      break;
  }
  
  // Show/hide no results message
  if (filteredItems.length === 0) {
    noResults.classList.remove('hidden');
  } else {
    noResults.classList.add('hidden');
  }
  
  // Create and append item cards
  filteredItems.forEach((item, index) => {
    // Add a slight delay to each item for a staggered animation effect
    setTimeout(() => {
      const card = createItemCard(item);
      itemsGrid.appendChild(card);
    }, index * 50);
  });
}

// Create an item card
function createItemCard(item) {
  const card = document.createElement('div');
  card.className = `item-card ${item.type}`;
  card.dataset.id = item.id;
  
  card.innerHTML = `
    <div class="item-header"></div>
    <div class="item-content">
      <div class="item-icon">${item.icon}</div>
      <h3 class="item-name">${item.name}</h3>
      <div class="item-type">${capitalizeFirstLetter(item.type)}</div>
    </div>
  `;
  
  // Add click event to open the modal
  card.addEventListener('click', () => openItemDetails(item));
  
  return card;
}

// Open item details modal
function openItemDetails(item) {
  // Set modal content
  document.getElementById('modal-item-name').textContent = item.name;
  document.getElementById('modal-item-icon').textContent = item.icon;
  
  const typeElement = document.getElementById('modal-item-type');
  typeElement.innerHTML = `<span class="tag ${item.type}">${capitalizeFirstLetter(item.type)}</span>`;
  
  document.getElementById('modal-item-version').textContent = item.version;
  document.getElementById('modal-item-author').textContent = item.author;
  document.getElementById('modal-item-description').textContent = item.description;
  
  // Show modal
  itemDetailsModal.classList.add('active');
}

// Close item details modal
function closeItemDetails() {
  itemDetailsModal.classList.remove('active');
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Event listeners
searchInput.addEventListener('input', () => {
  currentSearch = searchInput.value.trim();
  renderItems();
  
  // Show/hide clear button
  if (currentSearch) {
    clearSearchBtn.classList.add('visible');
  } else {
    clearSearchBtn.classList.remove('visible');
  }
});

clearSearchBtn.addEventListener('click', () => {
  searchInput.value = '';
  currentSearch = '';
  renderItems();
  clearSearchBtn.classList.remove('visible');
});

sortSelect.addEventListener('change', () => {
  currentSort = sortSelect.value;
  renderItems();
});

// Sidebar category filtering
sidebarItems.forEach(item => {
  item.addEventListener('click', () => {
    // Update active state
    sidebarItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    
    // Update filter
    currentFilter = item.dataset.filter;
    renderItems();
  });
});

// Modal close button
closeModalBtn.addEventListener('click', closeItemDetails);

// Close modal when clicking outside of it
itemDetailsModal.addEventListener('click', (e) => {
  if (e.target === itemDetailsModal) {
    closeItemDetails();
  }
});

// Modal action buttons (dummy functionality for demo)
document.getElementById('disable-item-btn').addEventListener('click', () => {
  alert('Item would be disabled. This is a demo functionality.');
  closeItemDetails();
});

document.getElementById('manage-item-btn').addEventListener('click', () => {
  alert('Item management view would open. This is a demo functionality.');
  closeItemDetails();
});

// Add Resource Modal Functionality
// Open Add Resource Modal
addResourceBtn.addEventListener('click', () => {
  // Reset form state
  resetAddResourceForm();
  // Show the modal
  addResourceModal.classList.add('active');
});

// Close Add Resource Modal
function closeAddResourceModal() {
  addResourceModal.classList.remove('active');
}

closeAddResourceModalBtn.addEventListener('click', closeAddResourceModal);
cancelAddResourceBtn.addEventListener('click', closeAddResourceModal);

// Close modals when clicking outside
addResourceModal.addEventListener('click', (e) => {
  if (e.target === addResourceModal) {
    closeAddResourceModal();
  }
});

resourceAddedModal.addEventListener('click', (e) => {
  if (e.target === resourceAddedModal) {
    resourceAddedModal.classList.remove('active');
  }
});

resourceConflictModal.addEventListener('click', (e) => {
  if (e.target === resourceConflictModal) {
    resourceConflictModal.classList.remove('active');
  }
});

// Resource type selection
resourceTypeOptions.forEach(option => {
  option.addEventListener('click', () => {
    // Remove active class from all options
    resourceTypeOptions.forEach(opt => opt.classList.remove('active'));
    // Add active class to selected option
    option.classList.add('active');
    // Update validation
    validateResourceForm();
  });
});

// Browse resource button
browseResourceBtn.addEventListener('click', async () => {
  // In a real app, this would use the main process to open a file dialog
  try {
    // Try to use the Electron API if available
    if (window.api && window.api.selectFolder) {
      const paths = await window.api.selectFolder();
      if (paths && paths.length > 0) {
        resourcePathInput.value = paths[0];
        
        // Show preview with data
        showResourcePreview({
          name: 'New Cool Plugin',
          id: 'cool-plugin-2023',
          version: '1.0.0',
          author: 'Developer Name',
          category: 'Games',
          description: 'This plugin adds cool new functionality to your Construct 2 projects.'
        });
      }
    } else {
      // For demo purposes when API is not available
      const mockPath = 'C:\\Users\\User\\Downloads\\NewPlugin';
      resourcePathInput.value = mockPath;
      
      // Show preview with mock data
      showResourcePreview({
        name: 'New Cool Plugin',
        id: 'cool-plugin-2023',
        version: '1.0.0',
        author: 'Developer Name',
        category: 'Games',
        description: 'This plugin adds cool new functionality to your Construct 2 projects.'
      });
      
      console.log("Note: In a real app, this would open a folder selection dialog");
    }
    
    // Update validation
    validateResourceForm();
  } catch (error) {
    console.error("Error selecting folder:", error);
    showResourceError("Failed to open folder selection dialog. Please try again.");
  }
});

// Add resource button
confirmAddResourceBtn.addEventListener('click', () => {
  // Get the selected resource type
  const selectedType = document.querySelector('.resource-type-option.active').dataset.type;
  const resourcePath = resourcePathInput.value;
  
  // Simulate checking for conflicts (in a real app, this would check if the resource already exists)
  const hasConflict = Math.random() > 0.5; // 50% chance of conflict for demo
  
  if (hasConflict) {
    // Show conflict modal
    conflictResourceName.textContent = 'New Cool Plugin';
    resourceConflictModal.classList.add('active');
  } else {
    // Show success modal
    successResourceName.textContent = 'New Cool Plugin';
    resourceAddedModal.classList.add('active');
    // Close the add resource modal
    closeAddResourceModal();
  }
});

// Success modal buttons
closeSuccessModalBtn.addEventListener('click', () => {
  resourceAddedModal.classList.remove('active');
});

okSuccessBtn.addEventListener('click', () => {
  resourceAddedModal.classList.remove('active');
});

// Conflict modal buttons
closeConflictModalBtn.addEventListener('click', () => {
  resourceConflictModal.classList.remove('active');
});

cancelOverwriteBtn.addEventListener('click', () => {
  resourceConflictModal.classList.remove('active');
});

confirmOverwriteBtn.addEventListener('click', () => {
  // In a real app, this would overwrite the existing resource
  resourceConflictModal.classList.remove('active');
  // Show success message
  successResourceName.textContent = 'New Cool Plugin';
  resourceAddedModal.classList.add('active');
  // Close the add resource modal
  closeAddResourceModal();
});

// Helper functions for Add Resource modal
function resetAddResourceForm() {
  // Reset resource type selection
  resourceTypeOptions.forEach(opt => opt.classList.remove('active'));
  resourceTypeOptions[0].classList.add('active'); // Select the first option by default
  
  // Reset path input
  resourcePathInput.value = '';
  
  // Hide error and preview
  resourceErrorContainer.classList.add('hidden');
  resourcePreview.classList.add('hidden');
  
  // Disable add button
  confirmAddResourceBtn.disabled = true;
}

function validateResourceForm() {
  // Check if a resource type is selected
  const hasType = document.querySelector('.resource-type-option.active') !== null;
  
  // Check if path is entered
  const hasPath = resourcePathInput.value.trim() !== '';
  
  // Enable/disable add button
  confirmAddResourceBtn.disabled = !(hasType && hasPath);
  
  return hasType && hasPath;
}

function showResourcePreview(resource) {
  // Set preview data
  document.getElementById('preview-name').textContent = resource.name;
  document.getElementById('preview-id').textContent = resource.id;
  document.getElementById('preview-version').textContent = resource.version;
  document.getElementById('preview-author').textContent = resource.author;
  document.getElementById('preview-category').textContent = resource.category;
  document.getElementById('preview-description').textContent = resource.description;
  
  // Show the resource type icon in preview
  const selectedType = document.querySelector('.resource-type-option.active').dataset.type;
  let iconText = '🔌'; // Default to plugin
  
  if (selectedType === 'behavior') {
    iconText = '🔄';
  } else if (selectedType === 'effect') {
    iconText = '✨';
  }
  
  // In a real app, this would be an actual image
  // For this demo, we'll use emoji as placeholder
  document.getElementById('preview-icon-img').innerHTML = iconText;
  
  // Show the preview section
  resourcePreview.classList.remove('hidden');
}

function showResourceError(message) {
  errorMessageElement.textContent = message;
  resourceErrorContainer.classList.remove('hidden');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderItems();
  
  // Add keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Escape to close modals
    if (e.key === 'Escape') {
      if (itemDetailsModal.classList.contains('active')) {
        closeItemDetails();
      }
      if (addResourceModal.classList.contains('active')) {
        closeAddResourceModal();
      }
      if (settingsModal.classList.contains('active')) {
        settingsModal.classList.remove('active');
      }
      if (resourceAddedModal.classList.contains('active')) {
        resourceAddedModal.classList.remove('active');
      }
      if (resourceConflictModal.classList.contains('active')) {
        resourceConflictModal.classList.remove('active');
      }
    }
    
    // Ctrl+F to focus search
    if (e.key === 'f' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      searchInput.focus();
    }
  });
});

// Initialize ResourceManager
const resourceManager = new ResourceManager();

// Browse resource button
browseResourceBtn.addEventListener('click', async () => {
  try {
    // Try to use the Electron API to select a folder
    if (window.api && window.api.selectFolder) {
      const paths = await window.api.selectFolder();
      if (paths && paths.length > 0) {
        resourcePathInput.value = paths[0];
        
        // Show empty preview form for the user to fill in
        resourceManager.showEmptyPreview();
      }
    } else {
      // For demo purposes when API is not available
      const mockPath = 'C:\\Users\\User\\Downloads\\NewPlugin';
      resourcePathInput.value = mockPath;
      
      // Show empty preview form
      resourceManager.showEmptyPreview();
      
      console.log("Note: In a real app, this would open a folder selection dialog");
    }
  } catch (error) {
    console.error("Error selecting folder:", error);
    resourceManager.showError("Failed to open folder selection dialog. Please try again.");
  }
});

// Add resource button
confirmAddResourceBtn.addEventListener('click', async () => {
  if (!resourceManager.validateForm()) {
    resourceManager.showError("Please fill in all required fields.");
    return;
  }
  
  // Get resource data
  const resourceData = resourceManager.getResourceData();
  
  // Try to add the resource
  try {
    // In a real app, this would use the window.api
    if (window.api) {
      // Check if resource exists
      const exists = await window.api.checkResourceExists(resourceData.type, resourceData.id);
      
      if (exists) {
        // Confirm overwrite
        const shouldOverwrite = await resourceManager.confirmOverwrite(resourceData.name);
        
        if (!shouldOverwrite) {
          return;
        }
      }
      
      // Create resource directories
      await window.api.createResourceDirectories();
      
      // Copy resource files
      await window.api.copyResourceFiles(resourceData.path, resourceData.type, resourceData.id);
      
      // Save resource metadata
      await window.api.saveResourceMetadata(resourceData);
      
      // Show success message
      resourceManager.showSuccessMessage(resourceData.name);
      
      // Close the add resource modal
      closeAddResourceModal();
      
      // Refresh the items list
      refreshItemsList();
    } else {
      // Demo version
      // Simulate adding resource
      setTimeout(() => {
        resourceManager.showSuccessMessage(resourceData.name);
        closeAddResourceModal();
      }, 500);
    }
  } catch (error) {
    console.error("Error adding resource:", error);
    resourceManager.showError("Failed to add resource: " + error.message);
  }
});

// Add this function to refresh the items list
async function refreshItemsList() {
  try {
    if (window.api && window.api.getAllResources) {
      const resources = await window.api.getAllResources();
      // Update your items display with the resources
      // For now, we'll just call renderItems() to show the sample data
      renderItems();
    } else {
      renderItems();
    }
  } catch (error) {
    console.error("Error refreshing items list:", error);
  }
}