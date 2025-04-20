import React from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useTodoContext, setLoading, deleteTodoAction, setError } from '../context/TodoContext';
import todoService from '../services/todoService';

const TodoItem = ({ todo }) => {
    const { dispatch } = useTodoContext();
    const { _id, title, description, status, createdAt } = todo;

    // Format the date
    const formattedDate = new Date(createdAt).toLocaleDateString();

    // Delete todo
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this todo?')) {
            try {
                dispatch(setLoading());
                await todoService.deleteTodo(_id);
                dispatch(deleteTodoAction(_id));
                toast.success('Todo deleted successfully');
            } catch (error) {
                dispatch(setError(error.message));
                toast.error(error.message);
            }
        }
    };

    return (
        <div className="todo-item fade-in">
            <div className="todo-content">
                <h3>{title}</h3>
                {description && <p>{description}</p>}
                <span className={`status ${status}`}>{status}</span>
                <p className="date">Created on: {formattedDate}</p>
            </div>
            <div className="actions">
                <Link to={`/edit/${_id}`} className="btn btn-secondary">
                    <FaEdit /> Edit
                </Link>
                <button onClick={handleDelete} className="btn btn-danger">
                    <FaTrash /> Delete
                </button>
            </div>
        </div>
    );
};

export default TodoItem;