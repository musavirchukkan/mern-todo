import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

const Header = () => {
    const location = useLocation();

    return (
        <header className="header">
            <h1>MERN Todo App</h1>
            <div>
                {location.pathname === '/' ? (
                    <Link to="/add" className="btn">
                        <FaPlus /> Add Todo
                    </Link>
                ) : (
                    <Link to="/" className="btn btn-secondary">
                        Back to Todos
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;