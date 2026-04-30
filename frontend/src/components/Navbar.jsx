import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
    FiSearch,
    FiUser,
    FiShoppingBag,
    FiMenu,
    FiX,
    FiHeart,
    FiPackage,
    FiLogOut
} from 'react-icons/fi';
import logo from '../assets/yarsa-logo.jpg';
import { useStore } from '../context/StoreContext.jsx';

export default function Navbar() {
    const { count, wishCount, user, setUser } = useStore();
    const [open, setOpen] = useState(false);
    const [showLogout, setShowLogout] = useState(false);
    const nav = useNavigate();

    const confirmLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setShowLogout(false);
        nav('/login');
    };

    return (
        <>
            <header className="nav">
                <Link to="/" className="brand">
                    <img src={logo} alt="YARSA" />
                </Link>

                <nav className={open ? 'open' : ''}>
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/collection">Collection</NavLink>
                    <NavLink to="/orders">Orders</NavLink>
                    <NavLink to="/about">About</NavLink>
                    <NavLink to="/contact">Contact</NavLink>
                </nav>

                <div className="nav-icons">
                    <button onClick={() => nav('/collection')}><FiSearch /></button>

                    <button className="bag" onClick={() => nav('/wishlist')}>
                        <FiHeart />
                        {wishCount > 0 && <span>{wishCount}</span>}
                    </button>

                    <button onClick={() => nav('/orders')}><FiPackage /></button>

                    {user ? (
                        <>
                            <button onClick={() => nav('/profile')}><FiUser /></button>
                            <button onClick={() => setShowLogout(true)} title="Logout">
                                <FiLogOut />
                            </button>
                        </>
                    ) : (
                        <button onClick={() => nav('/login')}><FiUser /></button>
                    )}

                    <button className="bag" onClick={() => nav('/cart')}>
                        <FiShoppingBag />
                        {count > 0 && <span>{count}</span>}
                    </button>

                    <button className="mobile" onClick={() => setOpen(!open)}>
                        {open ? <FiX /> : <FiMenu />}
                    </button>
                </div>
            </header>

            {showLogout && (
                <div className="logout-overlay">
                    <div className="logout-modal">
                        <div className="logout-icon">
                            <FiLogOut />
                        </div>

                        <h2>Logout?</h2>
                        <p>Are you sure you want to logout from your YARSA account?</p>

                        <div className="logout-actions">
                            <button className="cancel-btn" onClick={() => setShowLogout(false)}>
                                Cancel
                            </button>

                            <button className="confirm-btn" onClick={confirmLogout}>
                                Yes, Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}