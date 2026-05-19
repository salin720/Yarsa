import axios from 'axios';

export const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const api = axios.create({ baseURL: API });
api.interceptors.request.use((c) => {
    const t = localStorage.getItem('adminToken');
    if (t) c.headers.Authorization = 'Bearer ' + t;
    return c;
});
export const img = (x) => (!x ? '' : x.startsWith('/assets') ? x : API + x);
