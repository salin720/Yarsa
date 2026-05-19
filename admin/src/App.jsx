import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Add from './pages/Add.jsx';
import List from './pages/List.jsx';
import Orders from './pages/Orders.jsx';
import Profile from './pages/Profile.jsx';

function Private({ children }) {
    return localStorage.adminToken ? (
        <Layout>{children}</Layout>
    ) : (
        <Navigate to="/" />
    );
}

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route
                path="/dashboard"
                element={
                    <Private>
                        <Dashboard />
                    </Private>
                }
            />
            <Route
                path="/add"
                element={
                    <Private>
                        <Add />
                    </Private>
                }
            />
            <Route
                path="/edit/:id"
                element={
                    <Private>
                        <Add edit />
                    </Private>
                }
            />
            <Route
                path="/list"
                element={
                    <Private>
                        <List />
                    </Private>
                }
            />
            <Route
                path="/orders"
                element={
                    <Private>
                        <Orders />
                    </Private>
                }
            />
            <Route
                path="/profile"
                element={
                    <Private>
                        <Profile />
                    </Private>
                }
            />
        </Routes>
    );
}
