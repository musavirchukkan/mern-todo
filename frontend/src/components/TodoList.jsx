import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTodoContext, setLoading, setError, getTodos } from '../context/TodoContext';
import todoService from '../services/todoService';
import TodoItem from './TodoItem';
import Spinner from './Spinner';
import StatusFilter from './StatusFilter';

const TodoList = () => {
    const { state, dispatch } = useTodoContext();
    const { filteredTodos, loading, error } = state;

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                dispatch(setLoading());
                const todos = await todoService.getAllTodos();
                dispatch(getTodos(todos));
            } catch (error) {
                dispatch(setError(error.message));
                toast.error(error.message);
            }
        };

        fetchTodos();
    }, [dispatch]);

    if (loading) {
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
        <div className="todo-list-container">
            <StatusFilter />
            {filteredTodos.length === 0 ? (
                <div className="no-todos">
                    <p>No todos found.</p>
                </div>
            ) : (
                <div className="todo-list">
                    {filteredTodos.map((todo) => (
                        <TodoItem key={todo._id} todo={todo} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TodoList;