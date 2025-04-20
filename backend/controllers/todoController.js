const Todo = require('../models/todoModel');
const mongoose = require('mongoose');

// Helper function to check if ID is valid
const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

// @desc    Get all todos with filtering, sorting and pagination
// @route   GET /api/todos
// @access  Public
const getTodos = async (req, res) => {
    try {
        const { status, priority, search, sortBy, sortOrder, page = 1, limit = 10 } = req.query;

        // Build query
        const query = {};

        // Filter by status
        if (status && ['pending', 'in-progress', 'completed'].includes(status)) {
            query.status = status;
        }

        // Filter by priority
        if (priority && ['low', 'medium', 'high'].includes(priority)) {
            query.priority = priority;
        }

        // Search in title or description
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Determine sort options
        let sort = { createdAt: -1 }; // Default sort
        if (sortBy) {
            const order = sortOrder === 'asc' ? 1 : -1;
            sort = { [sortBy]: order };
        }

        // Calculate pagination
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;

        // Execute query with pagination
        const todos = await Todo.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limitNum);

        // Get total count for pagination
        const totalTodos = await Todo.countDocuments(query);

        // Return response with pagination info
        res.status(200).json({
            todos,
            pagination: {
                total: totalTodos,
                page: pageNum,
                limit: limitNum,
                pages: Math.ceil(totalTodos / limitNum)
            }
        });
    } catch (error) {
        console.error('Error in getTodos:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Get single todo
// @route   GET /api/todos/:id
// @access  Public
const getTodo = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID format
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid todo ID format'
            });
        }

        const todo = await Todo.findById(id);

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }

        res.status(200).json({
            success: true,
            data: todo
        });
    } catch (error) {
        console.error('Error in getTodo:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Create a todo
// @route   POST /api/todos
// @access  Public
const createTodo = async (req, res) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;

        // Validate required fields
        if (!title || title.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Title is required and cannot be empty'
            });
        }

        // Validate title length
        if (title.length > 100) {
            return res.status(400).json({
                success: false,
                message: 'Title cannot be more than 100 characters'
            });
        }

        // Validate status if provided
        if (status && !['pending', 'in-progress', 'completed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status must be one of: pending, in-progress, completed'
            });
        }

        // Validate priority if provided
        if (priority && !['low', 'medium', 'high'].includes(priority)) {
            return res.status(400).json({
                success: false,
                message: 'Priority must be one of: low, medium, high'
            });
        }

        // Validate due date if provided
        if (dueDate) {
            const dueDateObj = new Date(dueDate);
            if (isNaN(dueDateObj.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid due date format'
                });
            }
        }

        // Create todo with validated data
        const todo = await Todo.create({
            title,
            description,
            status: status || 'pending',
            priority: priority || 'medium',
            dueDate: dueDate || null
        });

        res.status(201).json({
            success: true,
            data: todo
        });
    } catch (error) {
        // Handle validation errors from mongoose
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                errors: messages
            });
        }

        console.error('Error in createTodo:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Update a todo
// @route   PUT /api/todos/:id
// @access  Public
const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, priority, dueDate } = req.body;

        // Validate ID format
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid todo ID format'
            });
        }

        // Check if todo exists
        const todo = await Todo.findById(id);
        if (!todo) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }

        // Validate title if provided
        if (title !== undefined) {
            if (title.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: 'Title cannot be empty'
                });
            }
            if (title.length > 100) {
                return res.status(400).json({
                    success: false,
                    message: 'Title cannot be more than 100 characters'
                });
            }
            todo.title = title;
        }

        // Validate and update status if provided
        if (status !== undefined) {
            if (!['pending', 'in-progress', 'completed'].includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Status must be one of: pending, in-progress, completed'
                });
            }
            todo.status = status;
        }

        // Validate and update priority if provided
        if (priority !== undefined) {
            if (!['low', 'medium', 'high'].includes(priority)) {
                return res.status(400).json({
                    success: false,
                    message: 'Priority must be one of: low, medium, high'
                });
            }
            todo.priority = priority;
        }

        // Validate due date if provided
        if (dueDate !== undefined) {
            if (dueDate === null) {
                todo.dueDate = null;
            } else {
                const dueDateObj = new Date(dueDate);
                if (isNaN(dueDateObj.getTime())) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid due date format'
                    });
                }
                todo.dueDate = dueDateObj;
            }
        }

        // Update description if provided
        if (description !== undefined) {
            todo.description = description;
        }

        // Save the updated todo
        const updatedTodo = await todo.save();

        res.status(200).json({
            success: true,
            data: updatedTodo
        });
    } catch (error) {
        // Handle validation errors from mongoose
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                errors: messages
            });
        }

        console.error('Error in updateTodo:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
// @access  Public
const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID format
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid todo ID format'
            });
        }

        // Find and delete the todo
        const todo = await Todo.findById(id);

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }

        await todo.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Todo removed successfully',
            id
        });
    } catch (error) {
        console.error('Error in deleteTodo:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Get todo statistics
// @route   GET /api/todos/stats
// @access  Public
const getTodoStats = async (req, res) => {
    try {
        const stats = await Todo.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    completed: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "completed"] }, 1, 0]
                        }
                    },
                    pending: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "pending"] }, 1, 0]
                        }
                    },
                    inProgress: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0]
                        }
                    }
                }
            }
        ]);

        // Format the response
        const result = stats.length > 0 ? stats[0] : {
            total: 0,
            completed: 0,
            pending: 0,
            inProgress: 0
        };

        // Remove the _id field from the result
        if (result._id !== undefined) {
            delete result._id;
        }

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error in getTodoStats:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

module.exports = {
    getTodos,
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo,
    getTodoStats
};