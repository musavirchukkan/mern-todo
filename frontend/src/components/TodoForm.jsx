import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSave, FaTimes } from 'react-icons/fa';

const TodoForm = ({ todo, onSubmit, buttonText, isSubmitting }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'pending'
    });

    const [touched, setTouched] = useState({
        title: false,
        description: false,
        status: false
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Update form when todo prop changes
    useEffect(() => {
        if (todo) {
            setFormData({
                title: todo.title || '',
                description: todo.description || '',
                status: todo.status || 'pending'
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
            status: true
        });

        const validationErrors = validate(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            onSubmit(formData);
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