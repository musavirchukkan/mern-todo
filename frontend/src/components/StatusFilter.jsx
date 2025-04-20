import React from 'react';
import { useTodoContext, filterTodos } from '../context/TodoContext';

const StatusFilter = () => {
    const { state, dispatch } = useTodoContext();
    const { currentFilter } = state;

    const handleFilter = (filter) => {
        dispatch(filterTodos(filter));
    };

    return (
        <div className="status-filter">
            <button
                className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
                onClick={() => handleFilter('all')}
            >
                All
            </button>
            <button
                className={`filter-btn ${currentFilter === 'pending' ? 'active' : ''}`}
                onClick={() => handleFilter('pending')}
            >
                Pending
            </button>
            <button
                className={`filter-btn ${currentFilter === 'in-progress' ? 'active' : ''}`}
                onClick={() => handleFilter('in-progress')}
            >
                In Progress
            </button>
            <button
                className={`filter-btn ${currentFilter === 'completed' ? 'active' : ''}`}
                onClick={() => handleFilter('completed')}
            >
                Completed
            </button>
        </div>
    );
};

export default StatusFilter;