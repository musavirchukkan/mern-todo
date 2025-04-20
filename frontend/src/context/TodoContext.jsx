import React, { createContext, useReducer, useContext, useCallback, useMemo } from 'react';

// Create context
const TodoContext = createContext();

// Initial state
const initialState = {
    todos: [],
    filteredTodos: [],
    currentFilter: 'all',
    loading: false,
    submitting: false,
    error: null,
    currentTodo: null,
    lastUpdated: null
};

// Action types
const TODO_REQUEST = 'TODO_REQUEST';
const TODO_SUBMIT = 'TODO_SUBMIT';
const TODO_SUCCESS = 'TODO_SUCCESS';
const TODO_ERROR = 'TODO_ERROR';
const GET_TODOS = 'GET_TODOS';
const GET_TODO = 'GET_TODO';
const ADD_TODO = 'ADD_TODO';
const UPDATE_TODO = 'UPDATE_TODO';
const DELETE_TODO = 'DELETE_TODO';
const FILTER_TODOS = 'FILTER_TODOS';
const CLEAR_CURRENT = 'CLEAR_CURRENT';
const CLEAR_ERROR = 'CLEAR_ERROR';

// Helper functions
const applyFilter = (todos, filter) => {
    if (!todos) return [];
    return filter === 'all'
        ? todos
        : todos.filter(todo => todo.status === filter);
};

// Reducer
const todoReducer = (state, action) => {
    switch (action.type) {
        case TODO_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case TODO_SUBMIT:
            return {
                ...state,
                submitting: true,
                error: null
            };
        case TODO_ERROR:
            return {
                ...state,
                loading: false,
                submitting: false,
                error: action.payload
            };
        case CLEAR_ERROR:
            return {
                ...state,
                error: null
            };
        case GET_TODOS:
            return {
                ...state,
                loading: false,
                todos: action.payload,
                filteredTodos: applyFilter(action.payload, state.currentFilter),
                lastUpdated: new Date().toISOString()
            };
        case GET_TODO:
            return {
                ...state,
                loading: false,
                currentTodo: action.payload
            };
        case ADD_TODO:
            const newTodos = [action.payload, ...state.todos];
            return {
                ...state,
                loading: false,
                submitting: false,
                todos: newTodos,
                filteredTodos: applyFilter(newTodos, state.currentFilter),
                lastUpdated: new Date().toISOString()
            };
        case UPDATE_TODO:
            const updatedTodos = state.todos.map(todo =>
                todo._id === action.payload._id ? action.payload : todo
            );
            return {
                ...state,
                loading: false,
                submitting: false,
                todos: updatedTodos,
                filteredTodos: applyFilter(updatedTodos, state.currentFilter),
                currentTodo: null,
                lastUpdated: new Date().toISOString()
            };
        case DELETE_TODO:
            const remainingTodos = state.todos.filter(todo => todo._id !== action.payload);
            return {
                ...state,
                loading: false,
                todos: remainingTodos,
                filteredTodos: applyFilter(remainingTodos, state.currentFilter),
                lastUpdated: new Date().toISOString()
            };
        case FILTER_TODOS:
            return {
                ...state,
                currentFilter: action.payload,
                filteredTodos: applyFilter(state.todos, action.payload)
            };
        case CLEAR_CURRENT:
            return {
                ...state,
                currentTodo: null
            };
        default:
            return state;
    }
};

// Provider component
export const TodoProvider = ({ children }) => {
    const [state, dispatch] = useReducer(todoReducer, initialState);

    // Memoized value for the context
    const contextValue = useMemo(() => ({ state, dispatch }), [state]);

    return (
        <TodoContext.Provider value={contextValue}>
            {children}
        </TodoContext.Provider>
    );
};

// Custom hook to use the todo context
export const useTodoContext = () => {
    const context = useContext(TodoContext);
    if (!context) {
        throw new Error('useTodoContext must be used within a TodoProvider');
    }
    return context;
};

// Action creators with useCallback
export const setLoading = () => ({ type: TODO_REQUEST });
export const setSubmitting = () => ({ type: TODO_SUBMIT });
export const setError = (error) => ({ type: TODO_ERROR, payload: error });
export const clearError = () => ({ type: CLEAR_ERROR });
export const getTodos = (todos) => ({ type: GET_TODOS, payload: todos });
export const getTodo = (todo) => ({ type: GET_TODO, payload: todo });
export const addTodo = (todo) => ({ type: ADD_TODO, payload: todo });
export const updateTodoAction = (todo) => ({ type: UPDATE_TODO, payload: todo });
export const deleteTodoAction = (id) => ({ type: DELETE_TODO, payload: id });
export const filterTodos = (filter) => ({ type: FILTER_TODOS, payload: filter });
export const clearCurrent = () => ({ type: CLEAR_CURRENT });

// Custom hooks for common operations
export const useTodoOperations = () => {
    const { dispatch } = useTodoContext();

    const handleError = useCallback((error) => {
        console.error('Todo operation error:', error);
        dispatch(setError(error.message || 'An unexpected error occurred'));
    }, [dispatch]);

    return {
        handleError,
        startLoading: useCallback(() => dispatch(setLoading()), [dispatch]),
        startSubmitting: useCallback(() => dispatch(setSubmitting()), [dispatch]),
        updateTodosList: useCallback((todos) => dispatch(getTodos(todos)), [dispatch]),
        updateSingleTodo: useCallback((todo) => dispatch(getTodo(todo)), [dispatch]),
        addNewTodo: useCallback((todo) => dispatch(addTodo(todo)), [dispatch]),
        updateExistingTodo: useCallback((todo) => dispatch(updateTodoAction(todo)), [dispatch]),
        deleteTodo: useCallback((id) => dispatch(deleteTodoAction(id)), [dispatch]),
        filterByStatus: useCallback((status) => dispatch(filterTodos(status)), [dispatch]),
        resetCurrentTodo: useCallback(() => dispatch(clearCurrent()), [dispatch]),
        resetError: useCallback(() => dispatch(clearError()), [dispatch])
    };
};