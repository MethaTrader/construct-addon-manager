 // DOM elements
const adminWarning = document.getElementById('admin-warning');
const welcomeScreen = document.getElementById('welcome-screen');
const pathSelectionScreen = document.getElementById('path-selection-screen');
const pathInput = document.getElementById('path-input');
const liabilityCheckbox = document.getElementById('liability-checkbox');
const continuePathBtn = document.getElementById('continue-path-btn');

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

continuePathBtn.addEventListener('click', () => {
  // For this implementation, we'll just alert
  alert('Installation path set successfully! The app would now proceed to the main interface.');
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