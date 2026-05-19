import axios from 'axios';

export const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const api = axios.create({baseURL: API});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = 'Bearer ' + token;
    return config;
});

export const img = (path) => {
    if (!path) return '/assets/frontend_assets/p_img1.png';
    if (path.startsWith('http')) return path;
    if (path.startsWith('/assets')) return path;
    return `${API}${path.startsWith('/') ? '' : '/'}${path}`;
};
