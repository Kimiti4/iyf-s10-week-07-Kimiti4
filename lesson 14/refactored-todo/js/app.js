/**
 * 🔹 app.js - Application entry point
 * Initializes modules and wires everything together
 */

// Import modules (works in modern browsers with type="module")
// For non-module fallback, functions are exposed to window.*

/**
 * Initialize the application
 */
function init() {
  console.log('🚀 To-Do App initializing...');
  
  // 1. Cache DOM elements
  if (window.ui?.cacheElements) {
    window.ui.cacheElements();
  }
  
  // 2. Load persisted state
  if (window.state?.initState) {
    window.state.initState();
    console.log('✅ State loaded from storage');
  }
  
  // 3. Subscribe to state changes for auto-render
  if (window.state?.subscribe && window.ui?.renderAll) {
    window.state.subscribe(() => {
      window.ui.renderAll();
    });
    console.log('✅ UI subscribed to state changes');
  }
  
  // 4. Set up event listeners
  if (window.ui?.setupEventListeners) {
    window.ui.setupEventListeners();
    console.log('✅ Event listeners attached');
  }
  
  // 5. Initial render
  if (window.ui?.renderAll) {
    window.ui.renderAll();
    console.log('✅ Initial render complete');
  }
  
  console.log('✨ To-Do App ready!');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // Already loaded
  init();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { init };
}