import React from 'react';
import TodoList from '../components/TodoList';
import TodoStats from '../components/TodoStats';

const HomePage = () => {
    return (
        <div>
            <h2>Todo Dashboard</h2>

            {/* Stats Section */}
            <TodoStats />

            {/* Todo List with integrated search */}
            <TodoList />
        </div>
    );
};

export default HomePage;