/**
 * 🔹 utils.js - Pure utility functions
 * No side effects, easily testable
 */

// Generate unique ID
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// Format ISO date to readable string
export function formatDate(isoString) {
  return new Date(isoString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Debounce function for input handling
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Expose for non-module usage (fallback)
if (typeof window !== 'undefined') {
  window.utils = { generateId, formatDate, debounce };
}