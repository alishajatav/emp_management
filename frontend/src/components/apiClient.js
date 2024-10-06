import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api', // Your API base URL
});

// Add a request interceptor
apiClient.interceptors.request.use((config) => {
    console.log("apiClient")
    const token = localStorage.getItem('token'); // Get the token from localStorage
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Set the Authorization header
        console.log("if block")
    }
    return config;
}, (error) => {
    console.log("erro block")
    return Promise.reject(error);

});

export default apiClient;
