import React from "react";
import logo from '../../imagen.jpg';

const Navbar = ({ title }) => {
    return (
        <nav className="navbar">
            <div className="navbar__container">
                <div className="navbar__actions">
                    <h1 className="navbar__title">{title}</h1>
                </div>
                    <div className="navbar__logo">
                        <img src={logo} alt="Logo" className="sidebar-logo-collapsed" />
                    </div>
            </div>
        </nav>
    );
};

export default Navbar;
