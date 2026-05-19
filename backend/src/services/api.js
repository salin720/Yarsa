import axios from 'axios';

/* ---------------- FIX: AUTO SWITCH ENV ---------------- */
const API = import.meta.env.VITE_API_URL || 'http://localhost:5001'; // fallback for local dev

export const api = axios.create({
    baseURL: API,
    withCredentials: true,
});

/* ---------------- IMAGE HELPER ---------------- */
export const img = (path) => {
    if (!path) return '';

    // already full URL
    if (path.startsWith('http')) return path;

    // local dev / production safe URL
    return `${API}${path}`;
};
