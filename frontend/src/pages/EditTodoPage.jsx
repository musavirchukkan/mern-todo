import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    useTodoContext,
    setLoading,
    getTodo,
    updateTodoAction,
    setError,
    clearCurrent
} from '../context/TodoContext';
import todoService from '../services/todoService';
import TodoForm from '../components/TodoForm';
import Spinner from '../components/Spinner';

const EditTodoPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { state, dispatch } = useTodoContext();
    const { currentTodo, loading, error } = state;

    useEffect(() => {
        const fetchTodo = async () => {
            try {
                dispatch(setLoading());
                const todo = await todoService.getTodoById(id);
                dispatch(getTodo(todo));
            } catch (error) {
                dispatch(setError(error.message));
                toast.error(error.message);
                navigate('/');
            }
        };

        fetchTodo();

        // Cleanup function
        return () => {
            dispatch(clearCurrent());
        };
    }, [id, dispatch, navigate]);

    const handleSubmit = async (formData) => {
        try {
            dispatch(setLoading());
            const updatedTodo = await todoService.updateTodo(id, formData);
            dispatch(updateTodoAction(updatedTodo));
            toast.success('Todo updated successfully');
            navigate('/');
        } catch (error) {
            dispatch(setError(error.message));
            toast.error(error.message);
        }
    };

    if (loading || !currentTodo) {
        return <Spinner />;
    }

    if (error) {
        return (
            <div className="error-message">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div>
            <h2>Edit Todo</h2>
            <TodoForm
                todo={currentTodo}
                onSubmit={handleSubmit}
                buttonText="Update Todo"
            />
        </div>
    );
};

export default EditTodoPage;