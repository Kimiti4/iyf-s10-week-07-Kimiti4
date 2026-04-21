/**
 * 🔹 state.js - Centralized state management
 * Handles todos, filters, persistence, and business logic
 */

import { load, save } from './storage.js';
import { generateId } from './utils.js';

// Storage keys
const TODOS_KEY = 'todos';
const FILTER_KEY = 'filter';

// Initial state
const initialState = {
  todos: [],
  filter: 'all' // 'all' | 'active' | 'completed'
};

// Private state
let state = { ...initialState };
let subscribers = [];

/**
 * Get current state (immutable copy)
 */
export function getState() {
  return JSON.parse(JSON.stringify(state));
}

/**
 * Update state and notify subscribers
 * @param {Object} updates - Partial state updates
 */
export function setState(updates) {
  // Validate filter values
  if (updates.filter && !['all', 'active', 'completed'].includes(updates.filter)) {
    console.warn('Invalid filter value:', updates.filter);
    return false;
  }
  
  // Update state immutably
  state = { ...state, ...updates };
  
  // Persist to storage
  save(TODOS_KEY, state.todos);
  save(FILTER_KEY, state.filter);
  
  // Notify all subscribers
  subscribers.forEach(callback => {
    try {
      callback(getState());
    } catch (error) {
      console.error('Subscriber error:', error);
    }
  });
  
  return true;
}

/**
 * Subscribe to state changes
 * @param {Function} callback - Function to call on state change
 * @returns {Function} Unsubscribe function
 */
export function subscribe(callback) {
  subscribers.push(callback);
  return () => {
    subscribers = subscribers.filter(cb => cb !== callback);
  };
}

/**
 * Initialize state from storage
 */
export function initState() {
  const savedTodos = load(TODOS_KEY, []);
  const savedFilter = load(FILTER_KEY, 'all');
  
  state = {
    todos: Array.isArray(savedTodos) ? savedTodos : [],
    filter: ['all', 'active', 'completed'].includes(savedFilter) ? savedFilter : 'all'
  };
  
  return getState();
}

// 🔹 Todo Business Logic

export function addTodo(text) {
  if (!text?.trim()) return false;
  
  const newTodo = {
    id: generateId(),
    text: text.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };
  
  setState({ todos: [...state.todos, newTodo] });
  return true;
}

export function toggleTodo(id) {
  const updated = state.todos.map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  setState({ todos: updated });
}

export function deleteTodo(id) {
  const updated = state.todos.filter(todo => todo.id !== id);
  setState({ todos: updated });
}

export function clearCompleted() {
  const updated = state.todos.filter(todo => !todo.completed);
  setState({ todos: updated });
}

export function setFilter(filter) {
  setState({ filter });
}

export function getFilteredTodos() {
  const { todos, filter } = state;
  
  if (filter === 'active') return todos.filter(t => !t.completed);
  if (filter === 'completed') return todos.filter(t => t.completed);
  return todos;
}

export function getStats() {
  const { todos } = state;
  const active = todos.filter(t => !t.completed).length;
  return {
    total: todos.length,
    active,
    completed: todos.length - active
  };
}

// Expose for non-module usage
if (typeof window !== 'undefined') {
  window.state = {
    getState, setState, subscribe, initState,
    addTodo, toggleTodo, deleteTodo, clearCompleted, setFilter,
    getFilteredTodos, getStats
  };
}