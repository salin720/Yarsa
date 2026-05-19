import axios from 'axios';

/* ---------------- SAFE ENV FALLBACK ---------------- */
const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

/* ---------------- AXIOS INSTANCE ---------------- */
export const api = axios.create({
    baseURL: API,
    withCredentials: true,
});

/* ---------------- IMAGE HELPER ---------------- */
export const img = (path) => {
    if (!path) return '';

    // already full URL
    if (path.startsWith('http')) return path;

    // remove double slashes issue
    return `${API}${path.startsWith('/') ? '' : '/'}${path}`;
};
