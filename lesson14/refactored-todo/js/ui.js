/**
 * 🔹 ui.js - DOM rendering and event handling
 * Separated from business logic for testability
 */

import { getFilteredTodos, getStats, toggleTodo, deleteTodo, clearCompleted, setFilter } from './state.js';
import { formatDate } from './utils.js';

// DOM element cache
let elements = {};

/**
 * Cache DOM elements for performance
 */
export function cacheElements() {
  elements = {
    todoInput: document.getElementById('todoInput'),
    addBtn: document.getElementById('addBtn'),
    todoList: document.getElementById('todoList'),
    stats: document.getElementById('stats'),
    filterBtns: document.querySelectorAll('.filter-btn')
  };
  return elements;
}

/**
 * Render the todo list based on current filter
 */
export function renderTodos() {
  const { todoList } = elements;
  if (!todoList) return;
  
  const todos = getFilteredTodos();
  
  if (todos.length === 0) {
    todoList.innerHTML = `<div class="empty">${getEmptyMessage()}</div>`;
    return;
  }
  
  todoList.innerHTML = todos.map(todo => `
    <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
      <input type="checkbox" class="todo-checkbox" 
             ${todo.completed ? 'checked' : ''} 
             aria-label="Mark ${todo.text} as ${todo.completed ? 'incomplete' : 'complete'}">
      <span class="todo-text">${escapeHtml(todo.text)}</span>
      <div class="todo-actions">
        <small class="todo-time" title="${todo.createdAt}">${formatDate(todo.createdAt)}</small>
        <button class="btn-delete" aria-label="Delete ${todo.text}">🗑️</button>
      </div>
    </div>
  `).join('');
  
  // Add clear completed button if needed
  const stats = getStats();
  if (stats.completed > 0) {
    todoList.innerHTML += `
      <div style="text-align:right;margin-top:0.5rem">
        <button id="clearCompleted" class="btn btn-sm btn-danger">
          Clear Completed (${stats.completed})
        </button>
      </div>
    `;
  }
}

/**
 * Render stats section
 */
export function renderStats() {
  const { stats: statsEl } = elements;
  if (!statsEl) return;
  
  const { total, active, completed } = getStats();
  statsEl.textContent = `${active} active • ${completed} completed • ${total} total`;
}

/**
 * Update filter button active states
 * @param {string} currentFilter - Active filter value
 */
export function renderFilters(currentFilter) {
  elements.filterBtns?.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === currentFilter);
  });
}

/**
 * Get empty state message based on filter
 */
function getEmptyMessage() {
  const { filter } = window.state?.getState?.() || { filter: 'all' };
  
  if (filter === 'all') return '📭 No tasks yet. Add one above!';
  if (filter === 'active') return '✅ All tasks completed! Great job!';
  return '🎉 No completed tasks yet';
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Set up event listeners
 */
export function setupEventListeners() {
  const { todoInput, addBtn, todoList, filterBtns } = elements;
  
  // Add todo on button click
  addBtn?.addEventListener('click', () => {
    const text = todoInput?.value;
    if (window.state?.addTodo?.(text)) {
      if (todoInput) todoInput.value = '';
      todoInput?.focus();
    }
  });
  
  // Add todo on Enter key
  todoInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && window.state?.addTodo?.(todoInput.value)) {
      todoInput.value = '';
    }
  });
  
  // Event delegation for todo list actions
  todoList?.addEventListener('click', (e) => {
    const item = e.target.closest('.todo-item');
    if (!item) return;
    
    const id = item.dataset.id;
    
    // Toggle completed
    if (e.target.classList.contains('todo-checkbox')) {
      window.state?.toggleTodo?.(id);
    }
    
    // Delete todo
    if (e.target.classList.contains('btn-delete')) {
      window.state?.deleteTodo?.(id);
    }
    
    // Clear completed
    if (e.target.id === 'clearCompleted') {
      window.state?.clearCompleted?.();
    }
  });
  
  // Filter buttons
  filterBtns?.forEach(btn => {
    btn.addEventListener('click', () => {
      window.state?.setFilter?.(btn.dataset.filter);
    });
  });
}

/**
 * Full re-render (called on state change)
 */
export function renderAll() {
  const currentState = window.state?.getState?.();
  if (!currentState) return;
  
  renderFilters(currentState.filter);
  renderTodos();
  renderStats();
}

// Expose for non-module usage
if (typeof window !== 'undefined') {
  window.ui = { cacheElements, renderAll, setupEventListeners };
}