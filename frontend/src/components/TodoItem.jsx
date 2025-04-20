import React, { useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useTodoContext, setLoading, deleteTodoAction, setError } from '../context/TodoContext';
import todoService from '../services/todoService';

const TodoItem = memo(({ todo }) => {
    const { dispatch } = useTodoContext();
    const { _id, title, description, status, createdAt, updatedAt } = todo;

    // Format the dates
    const formattedCreatedDate = new Date(createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    const formattedUpdatedDate = updatedAt && new Date(updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    // Delete todo with optimistic update
    const handleDelete = useCallback(async () => {
        if (window.confirm('Are you sure you want to delete this todo?')) {
            try {
                // Optimistic update
                dispatch(deleteTodoAction(_id));
                toast.info('Deleting todo...');

                // Actual API call
                await todoService.deleteTodo(_id);
                toast.success('Todo deleted successfully');
            } catch (error) {
                // Revert the optimistic update by refetching the data
                dispatch(setError(error.message));
                toast.error(`Failed to delete: ${error.message}`);
                // Refetch todos logic would go here
            }
        }
    }, [_id, dispatch]);

    // Get appropriate status class and icon
    const getStatusInfo = (status) => {
        switch (status) {
            case 'pending':
                return { className: 'pending', text: 'Pending' };
            case 'in-progress':
                return { className: 'in-progress', text: 'In Progress' };
            case 'completed':
                return { className: 'completed', text: 'Completed' };
            default:
                return { className: '', text: status };
        }
    };

    const statusInfo = getStatusInfo(status);

    return (
        <div className="todo-item fade-in">
            <div className="todo-content">
                <h3>{title}</h3>
                {description && <p className="description">{description}</p>}
                <div className="todo-meta">
                    <span className={`status ${statusInfo.className}`}>
                        {statusInfo.text}
                    </span>
                    <div className="dates">
                        <p className="date"><FaClock /> Created: {formattedCreatedDate}</p>
                        {formattedUpdatedDate && formattedUpdatedDate !== formattedCreatedDate && (
                            <p className="date">Updated: {formattedUpdatedDate}</p>
                        )}
                    </div>
                </div>
            </div>
            <div className="actions">
                <Link to={`/edit/${_id}`} className="btn btn-secondary">
                    <FaEdit /> Edit
                </Link>
                <button
                    onClick={handleDelete}
                    className="btn btn-danger"
                    aria-label={`Delete ${title}`}
                >
                    <FaTrash /> Delete
                </button>
            </div>
        </div>
    );
});

// Add display name for debugging
TodoItem.displayName = 'TodoItem';

export default TodoItem;