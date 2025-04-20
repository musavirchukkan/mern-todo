import axios from 'axios';

// Get the API URL from environment variables, with a fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/todos';

// Create a custom axios instance with default configuration
const api = axios.create({
    baseURL: API_URL,
    timeout: 10000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    }
});

// Response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle network errors
        if (!error.response) {
            return Promise.reject(new Error('Network error. Please check your connection.'));
        }

        // Format error message based on status code
        let errorMessage;
        switch (error.response.status) {
            case 400:
                errorMessage = error.response.data?.message || 'Invalid request. Please check your data.';
                break;
            case 401:
                errorMessage = 'Unauthorized. Please login again.';
                break;
            case 403:
                errorMessage = 'Forbidden. You do not have permission for this action.';
                break;
            case 404:
                errorMessage = 'Resource not found.';
                break;
            case 500:
                errorMessage = 'Server error. Please try again later.';
                break;
            default:
                errorMessage = error.response.data?.message || 'An unexpected error occurred.';
        }

        return Promise.reject(new Error(errorMessage));
    }
);

/**
 * Fetch all todos with optional filtering
 * @param {Object} params - Query parameters (optional)
 * @returns {Promise<Array>} - Array of todo objects
 */
const getAllTodos = async (params = {}) => {
    try {
        const response = await api.get('', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching todos:', error);
        throw error;
    }
};

/**
 * Get a single todo by ID
 * @param {string} id - Todo ID
 * @returns {Promise<Object>} - Todo object
 */
const getTodoById = async (id) => {
    if (!id) throw new Error('Todo ID is required');

    try {
        const response = await api.get(`/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching todo ${id}:`, error);
        throw error;
    }
};

/**
 * Create a new todo
 * @param {Object} todoData - Todo data
 * @returns {Promise<Object>} - Created todo object
 */
const createTodo = async (todoData) => {
    if (!todoData) throw new Error('Todo data is required');

    // Validate required fields
    if (!todoData.title) throw new Error('Title is required');

    try {
        const response = await api.post('', todoData);
        return response.data;
    } catch (error) {
        console.error('Error creating todo:', error);
        throw error;
    }
};

/**
 * Update an existing todo
 * @param {string} id - Todo ID
 * @param {Object} todoData - Updated todo data
 * @returns {Promise<Object>} - Updated todo object
 */
const updateTodo = async (id, todoData) => {
    if (!id) throw new Error('Todo ID is required');
    if (!todoData) throw new Error('Todo data is required');

    try {
        const response = await api.put(`/${id}`, todoData);
        return response.data;
    } catch (error) {
        console.error(`Error updating todo ${id}:`, error);
        throw error;
    }
};

/**
 * Delete a todo
 * @param {string} id - Todo ID
 * @returns {Promise<Object>} - Deletion confirmation
 */
const deleteTodo = async (id) => {
    if (!id) throw new Error('Todo ID is required');

    try {
        const response = await api.delete(`/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting todo ${id}:`, error);
        throw error;
    }
};

/**
 * Utility function to retry a failed request
 * @param {Function} apiCall - The API call function to retry
 * @param {Array} args - Arguments to pass to the API call
 * @param {number} maxRetries - Maximum number of retry attempts
 * @param {number} delay - Delay between retries in milliseconds
 * @returns {Promise} - Result of the API call
 */
const retryRequest = async (apiCall, args = [], maxRetries = 3, delay = 1000) => {
    let lastError;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await apiCall(...args);
        } catch (error) {
            lastError = error;
            // Only retry on network errors or 5xx server errors
            if (!error.response || (error.response.status >= 500 && error.response.status < 600)) {
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            throw error;
        }
    }

    throw lastError;
};

const todoService = {
    getAllTodos,
    getTodoById,
    createTodo,
    updateTodo,
    deleteTodo,
    retryRequest
};

export default todoService;