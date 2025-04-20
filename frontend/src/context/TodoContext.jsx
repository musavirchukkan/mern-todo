import React, { createContext, useReducer, useContext } from 'react';

// Create context
const TodoContext = createContext();

// Initial state
const initialState = {
    todos: [],
    filteredTodos: [],
    currentFilter: 'all',
    loading: false,
    error: null,
    currentTodo: null
};

// Action types
const TODO_REQUEST = 'TODO_REQUEST';
const TODO_SUCCESS = 'TODO_SUCCESS';
const TODO_ERROR = 'TODO_ERROR';
const GET_TODOS = 'GET_TODOS';
const GET_TODO = 'GET_TODO';
const ADD_TODO = 'ADD_TODO';
const UPDATE_TODO = 'UPDATE_TODO';
const DELETE_TODO = 'DELETE_TODO';
const FILTER_TODOS = 'FILTER_TODOS';
const CLEAR_CURRENT = 'CLEAR_CURRENT';

// Reducer
const todoReducer = (state, action) => {
    switch (action.type) {
        case TODO_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case TODO_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case GET_TODOS:
            return {
                ...state,
                loading: false,
                todos: action.payload,
                filteredTodos: state.currentFilter === 'all'
                    ? action.payload
                    : action.payload.filter(todo => todo.status === state.currentFilter)
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
                todos: newTodos,
                filteredTodos: state.currentFilter === 'all'
                    ? newTodos
                    : newTodos.filter(todo => todo.status === state.currentFilter)
            };
        case UPDATE_TODO:
            const updatedTodos = state.todos.map(todo =>
                todo._id === action.payload._id ? action.payload : todo
            );
            return {
                ...state,
                loading: false,
                todos: updatedTodos,
                filteredTodos: state.currentFilter === 'all'
                    ? updatedTodos
                    : updatedTodos.filter(todo => todo.status === state.currentFilter),
                currentTodo: null
            };
        case DELETE_TODO:
            const remainingTodos = state.todos.filter(todo => todo._id !== action.payload);
            return {
                ...state,
                loading: false,
                todos: remainingTodos,
                filteredTodos: state.currentFilter === 'all'
                    ? remainingTodos
                    : remainingTodos.filter(todo => todo.status === state.currentFilter)
            };
        case FILTER_TODOS:
            return {
                ...state,
                currentFilter: action.payload,
                filteredTodos: action.payload === 'all'
                    ? state.todos
                    : state.todos.filter(todo => todo.status === action.payload)
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

    return (
        <TodoContext.Provider value={{ state, dispatch }}>
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

// Action creators
export const setLoading = () => ({ type: TODO_REQUEST });
export const setError = (error) => ({ type: TODO_ERROR, payload: error });
export const getTodos = (todos) => ({ type: GET_TODOS, payload: todos });
export const getTodo = (todo) => ({ type: GET_TODO, payload: todo });
export const addTodo = (todo) => ({ type: ADD_TODO, payload: todo });
export const updateTodoAction = (todo) => ({ type: UPDATE_TODO, payload: todo });
export const deleteTodoAction = (id) => ({ type: DELETE_TODO, payload: id });
export const filterTodos = (filter) => ({ type: FILTER_TODOS, payload: filter });
export const clearCurrent = () => ({ type: CLEAR_CURRENT });