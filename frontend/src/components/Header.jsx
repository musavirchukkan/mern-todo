import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaPlus, FaArrowLeft } from 'react-icons/fa';

const Header = () => {
    const location = useLocation();

    return (
        <header className="header">
            <h1 className="app-title">MERN Todo App</h1>
            <div>
                {location.pathname === '/' ? (
                    <Link to="/add" className="btn btn-primary">
                        <FaPlus className="icon-margin" /> Add Todo
                    </Link>
                ) : (
                    <Link to="/" className="btn btn-secondary">
                        <FaArrowLeft className="icon-margin" /> Back to Todos
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;