const express = require('express');
const router = express.Router();
const {
    getTodos,
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo
} = require('../controllers/todoController');

// Get all todos and create todo
router.route('/')
    .get(getTodos)
    .post(createTodo);

// Get, update and delete todo by ID
router.route('/:id')
    .get(getTodo)
    .put(updateTodo)
    .delete(deleteTodo);

module.exports = router;