import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { FaSync, FaFilter, FaSortAmountDown, FaSortAmountUp, FaCalendarAlt, FaFlag, FaSearch, FaTimes } from 'react-icons/fa';
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
import PriorityFilter from './PriorityFilter';

const TodoList = () => {
    const { state, dispatch } = useTodoContext();
    const { filteredTodos, loading, error, lastUpdated } = state;
    const [sortField, setSortField] = useState('createdAt'); // 'createdAt', 'dueDate', 'priority'
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
    });

    // Add debounce to search for better performance
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => {
            clearTimeout(timerId);
        };
    }, [searchTerm]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const clearSearch = () => {
        setSearchTerm('');
    };




    // Fetch todos from the API
    const fetchTodos = useCallback(async (showRefreshIndicator = false) => {
        try {
            if (showRefreshIndicator) {
                setIsRefreshing(true);
            } else {
                dispatch(setLoading());
            }

            dispatch(clearError());

            // Construct query parameters
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                sortBy: sortField,
                sortOrder: sortOrder
            };

            // Add filters if they're active
            if (state.currentFilter !== 'all') {
                params.status = state.currentFilter;
            }

            if (priorityFilter !== 'all') {
                params.priority = priorityFilter;
            }

            // Add search term if provided
            if (debouncedSearchTerm && debouncedSearchTerm.trim() !== '') {
                params.search = debouncedSearchTerm.trim();
            }

            const response = await todoService.getAllTodos(params);

            // Check if the response has pagination info
            if (response.todos && response.pagination) {
                dispatch(getTodos(response.todos));
                setPagination(response.pagination);
            } else {
                // Fallback for old API or direct array response
                dispatch(getTodos(response));
            }

            if (showRefreshIndicator) {
                toast.success('Todos refreshed successfully');
            }
        } catch (error) {
            dispatch(setError(error.message));
            toast.error(error.message);
        } finally {
            setIsRefreshing(false);
        }
    }, [dispatch, pagination.page, pagination.limit, sortField, sortOrder, state.currentFilter, priorityFilter, debouncedSearchTerm]);


    // Initial data load
    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    // Sort the filtered todos
    const sortedTodos = useMemo(() => {
        if (!filteredTodos || filteredTodos.length === 0) return [];

        return [...filteredTodos].sort((a, b) => {
            // Handle undefined or null values
            const aValue = a[sortField] || '';
            const bValue = b[sortField] || '';

            // Special handling for dates
            if (sortField === 'createdAt' || sortField === 'dueDate') {
                const dateA = aValue ? new Date(aValue).getTime() : 0;
                const dateB = bValue ? new Date(bValue).getTime() : 0;

                return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            }

            // Special handling for priority
            if (sortField === 'priority') {
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                const priorityA = priorityOrder[aValue] || 0;
                const priorityB = priorityOrder[bValue] || 0;

                return sortOrder === 'asc' ? priorityA - priorityB : priorityB - priorityA;
            }

            // Default string comparison
            if (sortOrder === 'asc') {
                return String(aValue).localeCompare(String(bValue));
            } else {
                return String(bValue).localeCompare(String(aValue));
            }
        });
    }, [filteredTodos, sortField, sortOrder]);

    // Handle manual refresh
    const handleRefresh = () => {
        fetchTodos(true);
    };

    // Toggle sort order
    const toggleSortOrder = () => {
        setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
    };

    // Change sort field
    const handleSortFieldChange = (field) => {
        if (sortField === field) {
            // If clicking on the same field, toggle order
            toggleSortOrder();
        } else {
            // If clicking on a new field, set it and default to desc order
            setSortField(field);
            setSortOrder('desc');
        }
    };

    // Handle priority filter changes
    const handlePriorityFilter = (priority) => {
        setPriorityFilter(priority);
        // Reset pagination when changing filters
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
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
            <div className="filters-section">
                <StatusFilter />
                <div className="filter-divider"></div>
                <PriorityFilter
                    currentFilter={priorityFilter}
                    onFilterChange={handlePriorityFilter}
                />
                <div className="filter-divider"></div>
                {/* Search Bar */}
                <div className="search-filter">
                    <div className="search-input-wrapper">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search todos..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        {searchTerm && (
                            <button
                                className="search-clear-btn"
                                onClick={clearSearch}
                                aria-label="Clear search"
                            >
                                <FaTimes />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="todo-list-header">
                <div className="sort-options">
                    <span className="filter-label">Sort by:</span>
                    <button
                        className={`sort-btn ${sortField === 'createdAt' ? 'active' : ''}`}
                        onClick={() => handleSortFieldChange('createdAt')}
                    >
                        Date Created {sortField === 'createdAt' && (
                            sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />
                        )}
                    </button>
                    <button
                        className={`sort-btn ${sortField === 'dueDate' ? 'active' : ''}`}
                        onClick={() => handleSortFieldChange('dueDate')}
                    >
                        <FaCalendarAlt className="icon-margin" />
                        Due Date {sortField === 'dueDate' && (
                            sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />
                        )}
                    </button>
                    <button
                        className={`sort-btn ${sortField === 'priority' ? 'active' : ''}`}
                        onClick={() => handleSortFieldChange('priority')}
                    >
                        <FaFlag className="icon-margin" />
                        Priority {sortField === 'priority' && (
                            sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />
                        )}
                    </button>
                </div>
                <button
                    onClick={handleRefresh}
                    className="btn btn-sm"
                    disabled={isRefreshing}
                    title="Refresh todos"
                >
                    <FaSync className={isRefreshing ? 'spin' : ''} /> Refresh
                </button>
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
                <>
                    <div className="todo-list">
                        {sortedTodos.map((todo) => (
                            <TodoItem key={todo._id} todo={todo} />
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {pagination.pages > 1 && (
                        <div className="pagination">
                            <button
                                className="pagination-btn"
                                disabled={pagination.page === 1}
                                onClick={() => handlePageChange(pagination.page - 1)}
                            >
                                Previous
                            </button>

                            <span className="pagination-info">
                                Page {pagination.page} of {pagination.pages}
                            </span>

                            <button
                                className="pagination-btn"
                                disabled={pagination.page === pagination.pages}
                                onClick={() => handlePageChange(pagination.page + 1)}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default TodoList;