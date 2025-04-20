import React from 'react';
import { FaFilter, FaClock, FaHourglassHalf, FaCheckCircle } from 'react-icons/fa';
import { useTodoContext, filterTodos } from '../context/TodoContext';

const StatusFilter = () => {
    const { state, dispatch } = useTodoContext();
    const { currentFilter } = state;

    const handleFilter = (filter) => {
        dispatch(filterTodos(filter));
    };

    return (
        <div className="status-filter">
            <span className="filter-label">
                <FaFilter className="icon-margin" /> Status:
            </span>
            <div className="status-buttons">
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
                    <FaClock className="icon-margin" /> Pending
                </button>
                <button
                    className={`filter-btn ${currentFilter === 'in-progress' ? 'active' : ''}`}
                    onClick={() => handleFilter('in-progress')}
                >
                    <FaHourglassHalf className="icon-margin" /> In Progress
                </button>
                <button
                    className={`filter-btn ${currentFilter === 'completed' ? 'active' : ''}`}
                    onClick={() => handleFilter('completed')}
                >
                    <FaCheckCircle className="icon-margin" /> Completed
                </button>
            </div>
        </div>
    );
};

export default StatusFilter;