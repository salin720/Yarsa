import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    FiBarChart2,
    FiPlusCircle,
    FiList,
    FiPackage,
    FiUser,
} from 'react-icons/fi';
import Logo from './Logo.jsx';

export default function Layout({ children }) {
    const nav = useNavigate();
    return (
        <>
            <header>
                <Logo />
                <button
                    onClick={() => {
                        localStorage.removeItem('adminToken');
                        nav('/');
                    }}
                >
                    Logout
                </button>
            </header>
            <div className="layout">
                <aside>
                    <NavLink to="/dashboard">
                        <FiBarChart2 /> Dashboard
                    </NavLink>
                    <NavLink to="/add">
                        <FiPlusCircle /> Add Items
                    </NavLink>
                    <NavLink to="/list">
                        <FiList /> List Items
                    </NavLink>
                    <NavLink to="/orders">
                        <FiPackage /> Orders
                    </NavLink>
                    <NavLink to="/profile">
                        <FiUser /> Admin Profile
                    </NavLink>
                </aside>
                <section className="content">{children}</section>
            </div>
        </>
    );
}
