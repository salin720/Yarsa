import axios from 'axios';

/* ---------------- API BASE URL ---------------- */
export const API =
    import.meta.env.VITE_API_URL || 'https://yarsa-backend-sn3c.onrender.com';

export const api = axios.create({
    baseURL: API,
});

/* ---------------- AUTH TOKEN ---------------- */
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
});

/* ---------------- IMAGE HELPER (CLOUDINARY SAFE) ---------------- */
export const img = (url) => {
    if (!url) return '';

    // Cloudinary or any hosted image
    if (url.startsWith('http')) return url;

    // fallback for old assets (optional legacy support)
    if (url.startsWith('/assets')) return url;

    // fallback (should rarely be used now)
    return url;
};
