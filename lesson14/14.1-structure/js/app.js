/**
 * 🔹 app.js - Application entry point
 * Initializes modules and wires up UI
 */

// Demo functions for the HTML buttons
window.testUtils = function() {
  const output = document.getElementById('utilsOutput');
  
  // Test each utility
  const tests = [
    `formatDate: ${utils.formatDate(new Date().toISOString())}`,
    `generateId: ${utils.generateId()}`,
    `formatCurrency: ${utils.formatCurrency(1234.56)}`
  ];
  
  output.textContent = tests.join('\n');
};

window.testStorage = function() {
  const output = document.getElementById('storageOutput');
  const testData = { message: 'Hello from modular app!', timestamp: Date.now() };
  
  // Save
  const saved = storage.save('test_data', testData);
  
  // Load
  const loaded = storage.load('test_data');
  
  output.textContent = `Saved: ${saved}\nLoaded: ${JSON.stringify(loaded, null, 2)}`;
};

// Initialize app on load
document.addEventListener('DOMContentLoaded', () => {
  // Load persisted state
  state.initState();
  
  // Subscribe to state changes for UI updates
  state.subscribe((newState) => {
    ui.toggleTheme(newState.theme);
    ui.renderMessage('storageOutput', `State updated: theme = ${newState.theme}`, 'success');
  });
  
  console.log('✅ Modular app initialized');
});