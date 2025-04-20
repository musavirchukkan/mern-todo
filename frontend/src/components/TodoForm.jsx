import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TodoForm = ({ todo, onSubmit, buttonText }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'pending'
    });
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        if (todo) {
            setFormData({
                title: todo.title || '',
                description: todo.description || '',
                status: todo.status || 'pending'
            });
        }
    }, [todo]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear error for the field being changed
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (formData.status && !['pending', 'in-progress', 'completed'].includes(formData.status)) {
            newErrors.status = 'Status must be one of: pending, in-progress, completed';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        className="form-control"
                        value={formData.title}
                        onChange={handleChange}
                    />
                    {errors.title && <p className="error-text">{errors.title}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        className="form-control"
                        value={formData.description}
                        onChange={handleChange}
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="status">Status:</label>
                    <select
                        id="status"
                        name="status"
                        className="form-control"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                    {errors.status && <p className="error-text">{errors.status}</p>}
                </div>

                <div className="form-group">
                    <button type="submit" className="btn">{buttonText || 'Submit'}</button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TodoForm;