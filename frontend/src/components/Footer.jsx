import React from 'react';

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <p>MERN Todo App &copy; {year}</p>
            </div>
        </footer>
    );
};

export default Footer;