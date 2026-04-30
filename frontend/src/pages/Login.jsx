import React, {useState} from 'react';
import {toast} from 'react-toastify';
import {api} from '../services/api.js';
import {useNavigate} from 'react-router-dom';
import {useStore} from '../context/StoreContext.jsx';
import {FiMail, FiLock, FiUser, FiPhone, FiMapPin, FiEye, FiEyeOff} from 'react-icons/fi';

export default function Login() {
    const [mode, setMode] = useState('login');
    const [showPass, setShowPass] = useState(false);
    const {setUser} = useStore();
    const nav = useNavigate();

    async function sub(e) {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(e.currentTarget));

        try {
            if (mode === 'register') {
                await api.post('/api/auth/register', formData);
                toast.success('Account created. Please login');
                setMode('login');
                return;
            }

            const r = await api.post('/api/auth/login', formData);

            localStorage.token = r.data.token;
            localStorage.user = JSON.stringify(r.data.user);
            setUser(r.data.user);

            toast.success('Login successful');
            nav('/');
        } catch (e) {
            toast.error(e.response?.data?.message || 'Failed');
        }
    }

    return (
        <section className="auth auth-modern">
            <form onSubmit={sub} className="auth-card">

                <h1>{mode === 'login' ? 'Login to YARSA' : 'Create Account'}</h1>

                {mode === 'register' && (
                    <>
                        <label className="auth-field">
                            <FiUser />
                            <input name="name" placeholder="Full name" required />
                        </label>

                        <label className="auth-field">
                            <FiPhone />
                            <input name="phone" placeholder="Phone number" required />
                        </label>

                        <label className="auth-field">
                            <FiMapPin />
                            <input name="address" placeholder="Address" required />
                        </label>
                    </>
                )}

                <label className="auth-field">
                    <FiMail />
                    <input name="email" type="email" placeholder="Email" required />
                </label>

                <label className="auth-field">
                    <FiLock />
                    <input
                        name="password"
                        type={showPass ? 'text' : 'password'}
                        placeholder="Password"
                        required
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)}>
                        {showPass ? <FiEyeOff /> : <FiEye />}
                    </button>
                </label>

                <button className="auth-submit">
                    {mode === 'login' ? 'Sign In' : 'Register'}
                </button>

                <p className="auth-switch">
                    {mode === 'login' ? "Don't have account?" : 'Already have account?'}
                    <button
                        type="button"
                        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                    >
                        {mode === 'login' ? 'Register' : 'Login'}
                    </button>
                </p>
            </form>
        </section>
    );
}