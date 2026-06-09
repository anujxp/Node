import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api/v1/auth',
    withCredentials: true, // IMPORTANT: Allows browser to send/receive cookies
});

export default api;