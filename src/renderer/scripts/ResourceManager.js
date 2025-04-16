/**
 * Resource Manager
 * Handles all resource-related operations including:
 * - Resource parsing from selected directory
 * - Resource installation
 * - Resource metadata management
 */
class ResourceManager {
    constructor() {
      // Resource preview elements
      this.previewContainer = document.getElementById('resource-preview');
      this.nameInput = document.getElementById('preview-name-input');
      this.idInput = document.getElementById('preview-id-input');
      this.versionInput = document.getElementById('preview-version-input');
      this.authorInput = document.getElementById('preview-author-input');
      this.descriptionInput = document.getElementById('preview-description-input');
      this.previewIcon = document.getElementById('preview-icon-img');
      
      // Resource path
      this.resourcePathInput = document.getElementById('resource-path-input');
      
      // Resource type selection
      this.resourceTypeOptions = document.querySelectorAll('.resource-type-option');
      
      // Buttons
      this.addResourceBtn = document.getElementById('add-resource-btn');
      
      // Error container
      this.errorContainer = document.getElementById('resource-error');
      this.errorMessage = document.getElementById('error-message');
      
      // Current selected values
      this.selectedType = 'plugin'; // Default
      this.resourceIcon = '🔌'; // Default
      
      // Initialize event listeners
      this.initEventListeners();
    }
    
    /**
     * Initialize all event listeners
     */
    initEventListeners() {
      // Resource type selection
      this.resourceTypeOptions.forEach(option => {
        option.addEventListener('click', () => {
          this.setResourceType(option.dataset.type);
        });
      });
      
      // Form input validation
      const formInputs = [
        this.nameInput,
        this.idInput,
        this.versionInput,
        this.authorInput,
        this.descriptionInput
      ];
      
      formInputs.forEach(input => {
        input.addEventListener('input', () => {
          this.validateForm();
        });
      });
    }
    
    /**
     * Set the selected resource type
     * @param {string} type - The resource type (plugin, behavior, effect)
     */
    setResourceType(type) {
      // Update UI
      this.resourceTypeOptions.forEach(option => {
        option.classList.remove('active');
        if (option.dataset.type === type) {
          option.classList.add('active');
        }
      });
      
      // Update selected type
      this.selectedType = type;
      
      // Update default icon based on type
      let defaultIcon = '🔌'; // Default for plugin
      
      if (type === 'behavior') {
        defaultIcon = '🔄';
      } else if (type === 'effect') {
        defaultIcon = '✨';
      }
      
      // Set the icon
      this.resourceIcon = defaultIcon;
      
      // Update preview icon if element exists
      if (this.previewIcon) {
        this.previewIcon.textContent = defaultIcon;
      }
      
      // Validate form
      this.validateForm();
      
      // If a path is already selected, try to parse again with new type
      if (this.resourcePathInput.value) {
        this.parseResourceFromPath(this.resourcePathInput.value);
      }
    }
    
    /**
     * Parse resource from the selected path
     * @param {string} resourcePath - Path to the resource folder
     */
    async parseResourceFromPath(resourcePath) {
      try {
        // Show loading state
        this.showLoadingState();
        
        // In a real app, this would use Electron API to read files
        if (window.api && window.api.parseResourceInfo) {
          const resourceInfo = await window.api.parseResourceInfo(resourcePath, this.selectedType);
          
          if (resourceInfo) {
            this.showResourcePreview(resourceInfo);
          } else {
            throw new Error(`Could not parse resource information from ${resourcePath}`);
          }
        } else {
          // For demo: simulate resource parsing with mock data
          // This should be replaced with actual parsing in production
          console.log("Simulating resource parsing from path:", resourcePath);
          
          setTimeout(() => {
            // Generate mock data based on folder name
            const folderName = resourcePath.split(/[\\/]/).pop();
            
            const mockData = {
              name: folderName || 'Unknown Resource',
              id: folderName ? folderName.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'unknown-resource',
              version: '1.0.0',
              author: 'Unknown Author',
              description: 'No description available',
              icon: this.resourceIcon
            };
            
            this.showResourcePreview(mockData);
          }, 500);
        }
      } catch (error) {
        console.error("Error parsing resource:", error);
        this.showError("Failed to parse resource information: " + error.message);
        
        // Reset the preview
        this.hideLoading();
        this.hidePreview();
      }
    }
    
    /**
     * Show loading state
     */
    showLoadingState() {
      // Show loading indicator
      this.hidePreview();
      this.hideError();
      
      // Add loading state UI if not already present
      if (!document.getElementById('resource-loading')) {
        const loadingContainer = document.createElement('div');
        loadingContainer.id = 'resource-loading';
        loadingContainer.className = 'resource-loading';
        loadingContainer.innerHTML = `
          <div class="loading-spinner"></div>
          <p>Parsing resource information...</p>
        `;
        
        // Insert after resource path container
        const pathContainer = document.querySelector('.resource-path-container');
        if (pathContainer && pathContainer.parentNode) {
          pathContainer.parentNode.insertBefore(loadingContainer, pathContainer.nextSibling);
        }
      } else {
        document.getElementById('resource-loading').classList.remove('hidden');
      }
    }
    
    /**
     * Hide loading state
     */
    hideLoading() {
      const loadingContainer = document.getElementById('resource-loading');
      if (loadingContainer) {
        loadingContainer.classList.add('hidden');
      }
    }
    
    /**
     * Show resource preview with parsed data
     * @param {Object} data - Resource data
     */
    showResourcePreview(data) {
      // Hide loading state
      this.hideLoading();
      
      // Set values
      this.nameInput.value = data.name || '';
      this.idInput.value = data.id || '';
      this.versionInput.value = data.version || '1.0.0';
      this.authorInput.value = data.author || '';
      this.descriptionInput.value = data.description || '';
      
      // Set icon if provided
      if (data.icon && this.previewIcon) {
        this.resourceIcon = data.icon;
        this.previewIcon.textContent = data.icon;
      }
      
      // Show the preview container
      this.previewContainer.classList.remove('hidden');
      
      // Validate form
      this.validateForm();
    }
    
    /**
     * Hide the resource preview
     */
    hidePreview() {
      this.previewContainer.classList.add('hidden');
    }
    
    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
      this.errorMessage.textContent = message;
      this.errorContainer.classList.remove('hidden');
    }
    
    /**
     * Hide error message
     */
    hideError() {
      this.errorContainer.classList.add('hidden');
    }
    
    /**
     * Validate the resource form
     * @returns {boolean} - Is form valid
     */
    validateForm() {
      const resourcePath = this.resourcePathInput.value.trim();
      const name = this.nameInput.value.trim();
      const id = this.idInput.value.trim();
      const version = this.versionInput.value.trim();
      const author = this.authorInput.value.trim();
      
      // Check required fields
      const isValid = resourcePath !== '' && name !== '' && id !== '' && version !== '' && author !== '';
      
      // Enable/disable add button
      this.addResourceBtn.disabled = !isValid;
      
      return isValid;
    }
    
    /**
     * Get the current resource data
     * @returns {Object} - Resource data
     */
    getResourceData() {
      return {
        name: this.nameInput.value.trim(),
        id: this.idInput.value.trim(),
        version: this.versionInput.value.trim(),
        author: this.authorInput.value.trim(),
        description: this.descriptionInput.value.trim(),
        type: this.selectedType,
        icon: this.resourceIcon,
        path: this.resourcePathInput.value.trim()
      };
    }
    
    /**
     * Confirm overwrite with user
     * @param {string} resourceName - Resource name
     * @returns {Promise<boolean>} - Should overwrite
     */
    async confirmOverwrite(resourceName) {
      return new Promise((resolve) => {
        // Set the resource name in the conflict modal
        document.getElementById('conflict-resource-name').textContent = resourceName;
        
        // Show the conflict modal
        const conflictModal = document.getElementById('resource-conflict-modal');
        conflictModal.classList.add('active');
        
        // Get the buttons
        const cancelBtn = document.getElementById('cancel-overwrite-btn');
        const confirmBtn = document.getElementById('confirm-overwrite-btn');
        const closeBtn = document.getElementById('close-conflict-modal');
        
        // Define button actions
        const confirmAction = () => {
          // Remove event listeners
          cancelBtn.removeEventListener('click', cancelAction);
          confirmBtn.removeEventListener('click', confirmAction);
          closeBtn.removeEventListener('click', cancelAction);
          
          // Hide the modal
          conflictModal.classList.remove('active');
          
          // Resolve with true (overwrite)
          resolve(true);
        };
        
        const cancelAction = () => {
          // Remove event listeners
          cancelBtn.removeEventListener('click', cancelAction);
          confirmBtn.removeEventListener('click', confirmAction);
          closeBtn.removeEventListener('click', cancelAction);
          
          // Hide the modal
          conflictModal.classList.remove('active');
          
          // Resolve with false (don't overwrite)
          resolve(false);
        };
        
        // Add button event listeners
        cancelBtn.addEventListener('click', cancelAction);
        closeBtn.addEventListener('click', cancelAction);
        confirmBtn.addEventListener('click', confirmAction);
        
        // Handle clicking outside the modal
        conflictModal.addEventListener('click', (e) => {
          if (e.target === conflictModal) {
            cancelAction();
          }
        }, { once: true });
      });
    }
    
    /**
     * Show success message
     * @param {string} resourceName - Resource name
     */
    showSuccessMessage(resourceName) {
      // Set the resource name in the success modal
      document.getElementById('success-resource-name').textContent = resourceName;
      
      // Show the success modal
      const successModal = document.getElementById('resource-added-modal');
      successModal.classList.add('active');
      
      // Get the buttons
      const okBtn = document.getElementById('ok-success-btn');
      const closeBtn = document.getElementById('close-success-modal');
      
      // Define button action
      const closeAction = () => {
        // Remove event listeners
        okBtn.removeEventListener('click', closeAction);
        closeBtn.removeEventListener('click', closeAction);
        
        // Hide the modal
        successModal.classList.remove('active');
      };
      
      // Add button event listeners
      okBtn.addEventListener('click', closeAction);
      closeBtn.addEventListener('click', closeAction);
      
      // Handle clicking outside the modal
      successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
          closeAction();
        }
      }, { once: true });
    }
  }
  
  // Export for use in other files
  if (typeof window !== 'undefined') {
    window.ResourceManager = ResourceManager;
  }