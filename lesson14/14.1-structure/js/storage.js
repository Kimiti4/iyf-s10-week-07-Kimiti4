/**
 * 🔹 storage.js - localStorage abstraction
 * Handles JSON serialization, prefixes, errors
 */

const STORAGE_PREFIX = 'modular_demo_';

export function save(key, data) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Storage save error:', error);
    return false;
  }
}

export function load(key, defaultValue = null) {
  try {
    const data = localStorage.getItem(STORAGE_PREFIX + key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error('Storage load error:', error);
    return defaultValue;
  }
}

export function remove(key) {
  localStorage.removeItem(STORAGE_PREFIX + key);
}

export function clearAll() {
  Object.keys(localStorage)
    .filter(key => key.startsWith(STORAGE_PREFIX))
    .forEach(key => localStorage.removeItem(key));
}

// Expose for demo
window.storage = { save, load, remove, clearAll };