/**
 * 🔹 utils.js - Pure utility functions
 * No side effects, easily testable
 */

// Format date to readable string
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Generate unique ID (simple version)
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// Debounce function for performance
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

// Format currency
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

// For demo: expose to window since we're not using bundler
window.utils = { formatDate, generateId, debounce, formatCurrency };