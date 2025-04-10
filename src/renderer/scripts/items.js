// DOM Elements
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search');
const sortSelect = document.getElementById('sort-select');
const itemsGrid = document.querySelector('.items-grid');
const noResults = document.getElementById('no-results');
const sidebarItems = document.querySelectorAll('.sidebar-item');
const itemDetailsModal = document.getElementById('item-details-modal');
const closeModalBtn = document.getElementById('close-modal');

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

// Settings button to go back to home screen
document.getElementById('settings-btn').addEventListener('click', () => {
  // In a real app, this would show settings
  // For now, we'll use it to go back to the path selection screen
  if (window.api && window.api.navigateToHome) {
    window.api.navigateToHome();
  } else {
    alert('Navigation not available in this demo');
  }
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderItems();
  
  // Add keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Escape to close modal
    if (e.key === 'Escape' && itemDetailsModal.classList.contains('active')) {
      closeItemDetails();
    }
    
    // Ctrl+F to focus search
    if (e.key === 'f' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      searchInput.focus();
    }
  });
});