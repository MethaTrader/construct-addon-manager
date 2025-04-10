// DOM elements
const adminWarning = document.getElementById('admin-warning');
const welcomeScreen = document.getElementById('welcome-screen');
const pathSelectionScreen = document.getElementById('path-selection-screen');
const loadingScreen = document.getElementById('loading-screen');
const validationError = document.getElementById('validation-error');
const validationErrorMessage = document.getElementById('validation-error-message');
const pathInput = document.getElementById('path-input');
const liabilityCheckbox = document.getElementById('liability-checkbox');
const continuePathBtn = document.getElementById('continue-path-btn');

// Validation status elements
const behaviorsCheck = document.getElementById('behaviors-check');
const pluginsCheck = document.getElementById('plugins-check');
const effectsCheck = document.getElementById('effects-check');
const executableCheck = document.getElementById('executable-check');

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

// Check if app is running as admin
window.api.onNotAdmin(() => {
  adminWarning.classList.add('active');
});

// Admin warning buttons
document.getElementById('restart-admin-btn').addEventListener('click', () => {
  window.api.restartAsAdmin();
});

document.getElementById('continue-btn').addEventListener('click', () => {
  adminWarning.classList.remove('active');
});

// Welcome screen buttons with animations
const construct2Btn = document.getElementById('construct2-btn');
const construct3Btn = document.getElementById('construct3-btn');

construct2Btn.addEventListener('click', () => {
  switchScreen(welcomeScreen, pathSelectionScreen);
});

construct3Btn.addEventListener('click', () => {
  // Show notification that Construct 3 support is coming soon
  alert('Construct 3 support is coming soon!');
});

// Path selection screen
document.getElementById('browse-btn').addEventListener('click', async () => {
  const paths = await window.api.selectFolder();
  if (paths && paths.length > 0) {
    pathInput.value = paths[0];
    updateContinueButton();
  }
});

document.getElementById('back-btn').addEventListener('click', () => {
  switchScreen(pathSelectionScreen, welcomeScreen);
});

// Liability checkbox
liabilityCheckbox.addEventListener('change', updateContinueButton);

// Continue button handling with validation
continuePathBtn.addEventListener('click', async () => {
  const constructPath = pathInput.value.trim();
  
  // Switch to loading screen
  switchScreen(pathSelectionScreen, loadingScreen);
  
  // Reset validation status
  resetValidationStatus();
  
  // Run validation checks with visual feedback
  await validateConstructPath(constructPath);
});

// Try again button
document.getElementById('try-again-btn').addEventListener('click', () => {
  validationError.classList.remove('active');
  switchScreen(loadingScreen, pathSelectionScreen);
});

// Helper functions
function switchScreen(fromScreen, toScreen) {
  // Hide current screen with animation
  fromScreen.classList.remove('active');
  
  // Small delay before showing next screen for better transition
  setTimeout(() => {
    toScreen.classList.add('active');
  }, 300);
}

function updateContinueButton() {
  const hasPath = pathInput.value.trim() !== '';
  const hasAcceptedLiability = liabilityCheckbox.checked;
  
  continuePathBtn.disabled = !(hasPath && hasAcceptedLiability);
}

// Reset validation status indicators
function resetValidationStatus() {
  const statusItems = [behaviorsCheck, pluginsCheck, effectsCheck, executableCheck];
  
  statusItems.forEach(item => {
    item.className = 'status-item';
    const statusIcon = item.querySelector('.status-icon');
    statusIcon.textContent = '⬜';
    
    const statusText = item.querySelector('.status-text');
    
    // Reset text to default "checking" messages
    if (item === behaviorsCheck) {
      statusText.textContent = 'Checking behaviors folder...';
    } else if (item === pluginsCheck) {
      statusText.textContent = 'Checking plugins folder...';
    } else if (item === effectsCheck) {
      statusText.textContent = 'Checking effects folder...';
    } else if (item === executableCheck) {
      statusText.textContent = 'Checking Construct2.exe...';
    }
  });
}

// Validate Construct 2 path with visual feedback
async function validateConstructPath(constructPath) {
  try {
    // First set all items to "checking" state
    setItemStatus(behaviorsCheck, 'checking');
    
    // Small delay before checking behaviors to show the animation
    await delay(600);
    
    // Start validation process through the main process
    const validationResults = await window.api.validateConstructPath(constructPath);
    
    // Update behaviors check result
    updateItemStatus(behaviorsCheck, validationResults.behaviors, 
      'Behaviors folder found', 'Behaviors folder not found');
    
    // Add delay before checking plugins
    await delay(600);
    setItemStatus(pluginsCheck, 'checking');
    
    // Update plugins check result after a small delay
    await delay(600);
    updateItemStatus(pluginsCheck, validationResults.plugins,
      'Plugins folder found', 'Plugins folder not found');
    
    // Add delay before checking effects
    await delay(600);
    setItemStatus(effectsCheck, 'checking');
    
    // Update effects check result after a small delay
    await delay(600);
    updateItemStatus(effectsCheck, validationResults.effects,
      'Effects folder found', 'Effects folder not found');
    
    // Add delay before checking executable
    await delay(600);
    setItemStatus(executableCheck, 'checking');
    
    // Update executable check result after a small delay
    await delay(600);
    updateItemStatus(executableCheck, validationResults.executable,
      'Construct2.exe found', 'Construct2.exe not found');
    
    // Final validation result
    await delay(1000);
    if (validationResults.isValid) {
      // Navigate to the items page
      window.api.navigateToItems();
    } else {
      // Show validation error modal
      let errorMessage = 'The selected folder does not appear to be a valid Construct 2 installation.';
      
      // List specific missing items
      const missingItems = [];
      if (!validationResults.behaviors) missingItems.push('behaviors folder');
      if (!validationResults.plugins) missingItems.push('plugins folder');
      if (!validationResults.effects) missingItems.push('effects folder');
      if (!validationResults.executable) missingItems.push('Construct2.exe');
      
      if (missingItems.length > 0) {
        errorMessage += ' Missing: ' + missingItems.join(', ') + '.';
      }
      
      validationErrorMessage.textContent = errorMessage;
      validationError.classList.add('active');
    }
  } catch (error) {
    console.error('Validation error:', error);
    
    // Show error in modal
    validationErrorMessage.textContent = 'An error occurred during validation: ' + error.message;
    validationError.classList.add('active');
  }
}

// Set item status (checking, success, error)
function setItemStatus(element, status) {
  // First remove all status classes
  element.classList.remove('checking', 'success', 'error');
  
  // Add the requested status
  element.classList.add(status);
  
  // Update icon based on status
  const statusIcon = element.querySelector('.status-icon');
  if (status === 'checking') {
    statusIcon.textContent = '⏳';
  } else if (status === 'success') {
    statusIcon.textContent = '✅';
  } else if (status === 'error') {
    statusIcon.textContent = '❌';
  }
}

// Update item status based on validation result
function updateItemStatus(element, isValid, successMessage, errorMessage) {
  if (isValid) {
    setItemStatus(element, 'success');
    element.querySelector('.status-text').textContent = successMessage;
  } else {
    setItemStatus(element, 'error');
    element.querySelector('.status-text').textContent = errorMessage;
  }
}

// Helper function for creating delays
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Add hover animations for engine buttons
function addButtonAnimations() {
  const engineBtns = document.querySelectorAll('.engine-btn');
  
  engineBtns.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.3s ease';
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform 0.3s ease, border-color 0.3s ease';
    });
  });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  addButtonAnimations();
});