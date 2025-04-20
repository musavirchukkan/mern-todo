import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaHourglassHalf, FaClock, FaTasks } from 'react-icons/fa';
import todoService from '../services/todoService';
import Spinner from './Spinner';

const TodoStats = () => {
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        pending: 0,
        inProgress: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                setError(null);

                // Get stats from the new endpoint
                const response = await todoService.getTodoStats();

                // Handle both response formats
                const statsData = response.data || response;
                setStats(statsData);
            } catch (error) {
                console.error('Error fetching stats:', error);
                setError('Failed to load statistics. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="stats-container" style={{ minHeight: '120px', justifyContent: 'center' }}>
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-message">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="stats-container">
            <div className="stat-card">
                <div className="stat-icon">
                    <FaTasks />
                </div>
                <h3>Total</h3>
                <p>{stats.total}</p>
            </div>
            <div className="stat-card">
                <div className="stat-icon">
                    <FaClock />
                </div>
                <h3>Pending</h3>
                <p>{stats.pending}</p>
            </div>
            <div className="stat-card">
                <div className="stat-icon">
                    <FaHourglassHalf />
                </div>
                <h3>In Progress</h3>
                <p>{stats.inProgress}</p>
            </div>
            <div className="stat-card">
                <div className="stat-icon">
                    <FaCheckCircle />
                </div>
                <h3>Completed</h3>
                <p>{stats.completed}</p>
            </div>
        </div>
    );
};

export default TodoStats;