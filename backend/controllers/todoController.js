const Todo = require('../models/todoModel');

// @desc    Get all todos
// @route   GET /api/todos
// @access  Public
const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({}).sort({ createdAt: -1 });
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get single todo
// @route   GET /api/todos/:id
// @access  Public
const getTodo = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(200).json(todo);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create a todo
// @route   POST /api/todos
// @access  Public
const createTodo = async (req, res) => {
    try {
        const { title, description, status } = req.body;

        if (!title || title.trim() === '') {
            return res.status(400).json({ message: 'Title is required and cannot be empty' });
        }

        const statusValues = ['pending', 'in-progress', 'completed'];
        if (status && !statusValues.includes(status)) {
            return res.status(400).json({
                message: 'Status must be one of: pending, in-progress, completed'
            });
        }

        const todo = await Todo.create({
            title,
            description,
            status: status || 'pending'
        });

        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update a todo
// @route   PUT /api/todos/:id
// @access  Public
const updateTodo = async (req, res) => {
    try {
        const { title, description, status } = req.body;

        // Validate title if provided
        if (title !== undefined && title.trim() === '') {
            return res.status(400).json({ message: 'Title cannot be empty' });
        }

        // Validate status if provided
        const statusValues = ['pending', 'in-progress', 'completed'];
        if (status && !statusValues.includes(status)) {
            return res.status(400).json({
                message: 'Status must be one of: pending, in-progress, completed'
            });
        }

        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        // Update fields if provided
        if (title !== undefined) todo.title = title;
        if (description !== undefined) todo.description = description;
        if (status !== undefined) todo.status = status;

        const updatedTodo = await todo.save();
        res.status(200).json(updatedTodo);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
// @access  Public
const deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        await todo.deleteOne();
        res.status(200).json({ message: 'Todo removed', id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getTodos,
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo
};