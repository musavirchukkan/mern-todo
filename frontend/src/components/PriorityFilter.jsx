import React from 'react';
import { FaFlag, FaExclamationCircle, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

const PriorityFilter = ({ currentFilter, onFilterChange }) => {
    return (
        <div className="priority-filter">
            <span className="filter-label"><FaFlag className="icon-margin" /> Priority:</span>
            <div className="priority-buttons">
                <button
                    className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
                    onClick={() => onFilterChange('all')}
                >
                    All
                </button>
                <button
                    className={`filter-btn priority-high ${currentFilter === 'high' ? 'active' : ''}`}
                    onClick={() => onFilterChange('high')}
                >
                    <FaExclamationCircle className="icon-margin" /> High
                </button>
                <button
                    className={`filter-btn priority-medium ${currentFilter === 'medium' ? 'active' : ''}`}
                    onClick={() => onFilterChange('medium')}
                >
                    <FaCheckCircle className="icon-margin" /> Medium
                </button>
                <button
                    className={`filter-btn priority-low ${currentFilter === 'low' ? 'active' : ''}`}
                    onClick={() => onFilterChange('low')}
                >
                    <FaInfoCircle className="icon-margin" /> Low
                </button>
            </div>
        </div>
    );
};

export default PriorityFilter;