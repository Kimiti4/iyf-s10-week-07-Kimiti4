/**
 * 🔹 ui.js - DOM manipulation functions
 * Separated from business logic
 */

export function renderMessage(elementId, message, type = 'info') {
  const el = document.getElementById(elementId);
  if (!el) return;
  
  const colors = {
    info: '#3b82f6',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b'
  };
  
  el.innerHTML = `<span style="color:${colors[type]}">${message}</span>`;
}

export function toggleTheme(theme) {
  document.body.style.background = theme === 'dark' ? '#1e293b' : '#f8fafc';
  document.body.style.color = theme === 'dark' ? '#e2e8f0' : '#1e293b';
}

export function createItemList(items) {
  if (!items.length) return '<p><em>No items</em></p>';
  
  return `<ul>${items.map(item => 
    `<li>${window.utils?.formatDate?.(item.date) || item.date}: ${item.text}</li>`
  ).join('')}</ul>`;
}

// Expose for demo
window.ui = { renderMessage, toggleTheme, createItemList };