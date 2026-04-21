/**
 * 🔹 storage.js - localStorage abstraction layer
 * Handles JSON serialization, error handling, namespacing
 */

const STORAGE_PREFIX = 'todo_app_';

/**
 * Save data to localStorage with error handling
 * @param {string} key - Storage key (without prefix)
 * @param {*} data - Data to store (will be JSON.stringified)
 * @returns {boolean} Success status
 */
export function save(key, data) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('❌ Storage save error:', error);
    return false;
  }
}

/**
 * Load data from localStorage with error handling
 * @param {string} key - Storage key (without prefix)
 * @param {*} defaultValue - Value to return if key not found
 * @returns {*} Parsed data or default value
 */
export function load(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('❌ Storage load error:', error);
    return defaultValue;
  }
}

/**
 * Remove item from localStorage
 * @param {string} key - Storage key (without prefix)
 */
export function remove(key) {
  localStorage.removeItem(STORAGE_PREFIX + key);
}

/**
 * Clear all app-related storage items
 */
export function clearAll() {
  Object.keys(localStorage)
    .filter(key => key.startsWith(STORAGE_PREFIX))
    .forEach(key => localStorage.removeItem(key));
}

// Expose for non-module usage
if (typeof window !== 'undefined') {
  window.storage = { save, load, remove, clearAll };
}