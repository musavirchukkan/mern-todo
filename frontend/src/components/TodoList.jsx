import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { FaSync, FaFilter, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
    useTodoContext,
    setLoading,
    setError,
    getTodos,
    clearError
} from '../context/TodoContext';
import todoService from '../services/todoService';
import TodoItem from './TodoItem';
import Spinner from './Spinner';
import StatusFilter from './StatusFilter';

const TodoList = () => {
    const { state, dispatch } = useTodoContext();
    const { filteredTodos, loading, error, lastUpdated } = state;
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Fetch todos from the API
    const fetchTodos = useCallback(async (showRefreshIndicator = false) => {
        try {
            if (showRefreshIndicator) {
                setIsRefreshing(true);
            } else {
                dispatch(setLoading());
            }

            dispatch(clearError());
            const todos = await todoService.retryRequest(todoService.getAllTodos);
            dispatch(getTodos(todos));

            if (showRefreshIndicator) {
                toast.success('Todos refreshed successfully');
            }
        } catch (error) {
            dispatch(setError(error.message));
            toast.error(error.message);
        } finally {
            setIsRefreshing(false);
        }
    }, [dispatch]);

    // Initial data load
    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    // Sort the filtered todos
    const sortedTodos = useMemo(() => {
        if (!filteredTodos) return [];

        return [...filteredTodos].sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();

            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
    }, [filteredTodos, sortOrder]);

    // Handle manual refresh
    const handleRefresh = () => {
        fetchTodos(true);
    };

    // Toggle sort order
    const toggleSortOrder = () => {
        setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
    };

    // Render loading spinner
    if (loading && !isRefreshing) {
        return <Spinner />;
    }

    // Render error message
    if (error) {
        return (
            <div className="error-message">
                <p>{error}</p>
                <button onClick={handleRefresh} className="btn btn-secondary mt-3">
                    <FaSync /> Try Again
                </button>
            </div>
        );
    }

    const formatLastUpdated = () => {
        if (!lastUpdated) return null;

        const date = new Date(lastUpdated);
        return date.toLocaleTimeString();
    };

    return (
        <div className="todo-list-container">
            <div className="todo-list-header">
                <StatusFilter />
                <div className="todo-list-actions">
                    <button
                        onClick={toggleSortOrder}
                        className="btn btn-sm btn-secondary"
                        title={sortOrder === 'asc' ? 'Sort by newest' : 'Sort by oldest'}
                    >
                        {sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
                        {' '}Sort
                    </button>
                    <button
                        onClick={handleRefresh}
                        className="btn btn-sm"
                        disabled={isRefreshing}
                        title="Refresh todos"
                    >
                        <FaSync className={isRefreshing ? 'spin' : ''} /> Refresh
                    </button>
                </div>
            </div>

            {lastUpdated && (
                <div className="last-updated">
                    Last updated: {formatLastUpdated()}
                </div>
            )}

            {sortedTodos.length === 0 ? (
                <div className="no-todos">
                    <p>No todos found. Add a new todo to get started!</p>
                </div>
            ) : (
                <div className="todo-list">
                    {sortedTodos.map((todo) => (
                        <TodoItem key={todo._id} todo={todo} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TodoList;