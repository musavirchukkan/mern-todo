import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSave, FaTimes, FaCalendarAlt, FaFlag } from 'react-icons/fa';

const TodoForm = ({ todo, onSubmit, buttonText, isSubmitting }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: ''
    });

    const [touched, setTouched] = useState({
        title: false,
        description: false,
        status: false,
        priority: false,
        dueDate: false
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Update form when todo prop changes
    useEffect(() => {
        if (todo) {
            // Format the date for the input field if it exists
            const formattedDueDate = todo.dueDate
                ? new Date(todo.dueDate).toISOString().split('T')[0]
                : '';

            setFormData({
                title: todo.title || '',
                description: todo.description || '',
                status: todo.status || 'pending',
                priority: todo.priority || 'medium',
                dueDate: formattedDueDate
            });
        }
    }, [todo]);

    const validate = useCallback((data) => {
        const newErrors = {};

        if (!data.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (data.title.trim().length < 3) {
            newErrors.title = 'Title must be at least 3 characters';
        } else if (data.title.trim().length > 100) {
            newErrors.title = 'Title must be less than 100 characters';
        }

        if (data.description && data.description.length > 500) {
            newErrors.description = 'Description must be less than 500 characters';
        }

        if (!data.status || !['pending', 'in-progress', 'completed'].includes(data.status)) {
            newErrors.status = 'Please select a valid status';
        }

        if (!data.priority || !['low', 'medium', 'high'].includes(data.priority)) {
            newErrors.priority = 'Please select a valid priority';
        }

        if (data.dueDate) {
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);
            const selectedDate = new Date(data.dueDate);
            selectedDate.setHours(0, 0, 0, 0);

            if (selectedDate < currentDate) {
                newErrors.dueDate = 'Due date cannot be in the past';
            }
        }

        return newErrors;
    }, []);

    // Validate on field change
    useEffect(() => {
        const validateField = () => {
            const validationErrors = validate(formData);
            setErrors(validationErrors);
            return Object.keys(validationErrors).length === 0;
        };

        validateField();
    }, [formData, validate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Mark all fields as touched
        setTouched({
            title: true,
            description: true,
            status: true,
            priority: true,
            dueDate: true
        });

        const validationErrors = validate(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            // Prepare data for submission
            const submissionData = {
                ...formData,
                // If dueDate is empty string, set it to null
                dueDate: formData.dueDate || null
            };

            onSubmit(submissionData);
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    const isFieldInvalid = (field) => {
        return touched[field] && errors[field];
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} noValidate>
                <div className={`form-group ${isFieldInvalid('title') ? 'has-error' : ''}`}>
                    <label htmlFor="title">Title <span className="required">*</span></label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        className={`form-control ${isFieldInvalid('title') ? 'is-invalid' : ''}`}
                        value={formData.title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter todo title"
                        disabled={isSubmitting}
                        required
                    />
                    {isFieldInvalid('title') && (
                        <div className="error-message">{errors.title}</div>
                    )}
                </div>

                <div className={`form-group ${isFieldInvalid('description') ? 'has-error' : ''}`}>
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        className={`form-control ${isFieldInvalid('description') ? 'is-invalid' : ''}`}
                        value={formData.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter optional description"
                        disabled={isSubmitting}
                        rows="4"
                    ></textarea>
                    {isFieldInvalid('description') && (
                        <div className="error-message">{errors.description}</div>
                    )}
                    <div className="character-count">
                        {formData.description.length}/500 characters
                    </div>
                </div>

                <div className="form-row">
                    <div className={`form-group ${isFieldInvalid('status') ? 'has-error' : ''}`}>
                        <label htmlFor="status">Status <span className="required">*</span></label>
                        <select
                            id="status"
                            name="status"
                            className={`form-control ${isFieldInvalid('status') ? 'is-invalid' : ''}`}
                            value={formData.status}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={isSubmitting}
                            required
                        >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        {isFieldInvalid('status') && (
                            <div className="error-message">{errors.status}</div>
                        )}
                    </div>

                    <div className={`form-group ${isFieldInvalid('priority') ? 'has-error' : ''}`}>
                        <label htmlFor="priority">Priority <span className="required">*</span></label>
                        <select
                            id="priority"
                            name="priority"
                            className={`form-control ${isFieldInvalid('priority') ? 'is-invalid' : ''}`}
                            value={formData.priority}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={isSubmitting}
                            required
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                        {isFieldInvalid('priority') && (
                            <div className="error-message">{errors.priority}</div>
                        )}
                    </div>
                </div>

                <div className={`form-group ${isFieldInvalid('dueDate') ? 'has-error' : ''}`}>
                    <label htmlFor="dueDate">
                        <FaCalendarAlt className="icon-margin" /> Due Date
                    </label>
                    <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        className={`form-control ${isFieldInvalid('dueDate') ? 'is-invalid' : ''}`}
                        value={formData.dueDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={isSubmitting}
                    />
                    {isFieldInvalid('dueDate') && (
                        <div className="error-message">{errors.dueDate}</div>
                    )}
                </div>

                <div className="form-buttons">
                    <button
                        type="submit"
                        className="btn"
                        disabled={isSubmitting}
                    >
                        <FaSave /> {buttonText || 'Submit'} {isSubmitting && <span className="spinner-small"></span>}
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                    >
                        <FaTimes /> Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TodoForm;