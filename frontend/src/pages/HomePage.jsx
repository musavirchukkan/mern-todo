import React from 'react';
import TodoList from '../components/TodoList';

const HomePage = () => {
    return (
        <div>
            <h2>Your Todos</h2>
            <TodoList />
        </div>
    );
};

export default HomePage;