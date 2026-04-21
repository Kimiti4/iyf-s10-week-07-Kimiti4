/**
 * 🔹 state.js - Centralized application state
 * With persistence and validation
 */

// Initial state
const initialState = {
  user: null,
  theme: 'light',
  items: []
};

// Current state (private)
let state = { ...initialState };

// Subscribers for reactivity
const subscribers = [];

export function getState() {
  return { ...state }; // Return copy to prevent direct mutation
}

export function setState(updates) {
  // Validate updates (example: theme must be valid)
  if (updates.theme && !['light', 'dark'].includes(updates.theme)) {
    console.warn('Invalid theme value');
    return false;
  }
  
  // Update state immutably
  state = { ...state, ...updates };
  
  // Persist to storage
  window.storage?.save('app_state', state);
  
  // Notify subscribers
  subscribers.forEach(callback => callback(state));
  
  return true;
}

export function subscribe(callback) {
  subscribers.push(callback);
  // Return unsubscribe function
  return () => {
    const index = subscribers.indexOf(callback);
    if (index > -1) subscribers.splice(index, 1);
  };
}

// Load persisted state on init
export function initState() {
  const saved = window.storage?.load('app_state');
  if (saved) {
    state = { ...initialState, ...saved };
  }
  return state;
}

// Expose for demo
window.state = { getState, setState, subscribe, initState };