import axios from 'axios';

const API_URL = 'http://localhost:5001/api/todos';

// Get all todos
const getAllTodos = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch todos');
    }
};

// Get a single todo
const getTodoById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch todo');
    }
};

// Create a new todo
const createTodo = async (todoData) => {
    try {
        const response = await axios.post(API_URL, todoData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to create todo');
    }
};

// Update a todo
const updateTodo = async (id, todoData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, todoData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update todo');
    }
};

// Delete a todo
const deleteTodo = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete todo');
    }
};

const todoService = {
    getAllTodos,
    getTodoById,
    createTodo,
    updateTodo,
    deleteTodo
};

export default todoService;