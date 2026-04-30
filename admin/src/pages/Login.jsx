import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../services/api.js';
import Logo from '../components/Logo.jsx';

export default function Login() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  async function sub(e) {
    e.preventDefault(); setLoading(true);
    try {
      const r = await api.post('/api/auth/admin', Object.fromEntries(new FormData(e.currentTarget)));
      localStorage.adminToken = r.data.token;
      toast.success('Admin login successful');
      nav('/dashboard');
    } catch (e) { toast.error(e.response?.data?.message || 'Invalid admin login'); }
    finally { setLoading(false); }
  }
  return <main className="login"><form onSubmit={sub}><Logo/><h1>Admin Panel</h1><label>Email Address</label><input name="email" defaultValue="admin@yarsa.com"/><label>Password</label><input name="password" type="password" defaultValue="admin123"/><button>{loading?'Logging in...':'Login'}</button></form></main>;
}
