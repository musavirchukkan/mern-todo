import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTodoContext, setLoading, addTodo, setError } from '../context/TodoContext';
import todoService from '../services/todoService';
import TodoForm from '../components/TodoForm';

const AddTodoPage = () => {
    const { dispatch } = useTodoContext();
    const navigate = useNavigate();

    const handleSubmit = async (formData) => {
        try {
            dispatch(setLoading());
            const newTodo = await todoService.createTodo(formData);
            dispatch(addTodo(newTodo));
            toast.success('Todo added successfully');
            navigate('/');
        } catch (error) {
            dispatch(setError(error.message));
            toast.error(error.message);
        }
    };

    return (
        <div>
            <h2>Add New Todo</h2>
            <TodoForm onSubmit={handleSubmit} buttonText="Add Todo" />
        </div>
    );
};

export default AddTodoPage;