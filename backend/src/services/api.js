import axios from 'axios';

const API = 'http://localhost:5001';

export const api = axios.create({
    baseURL: API
});

export const img = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return API + path;
};