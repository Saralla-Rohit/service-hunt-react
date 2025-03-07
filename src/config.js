const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5678'
    : 'https://service-hunt-react-1.onrender.com';

export default API_URL;
