import React, { useState } from 'react';
import apiClient from './apiClient'; 
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { useAuth } from './AuthContext';

const Login = () => {
    const [loginData, setLoginData] = useState({
        UserName: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { login } = useAuth(); 


    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });            
    }  
    
    const validateForm = () => {
        const newErrors = {};
        if (!loginData.UserName) newErrors.UserName = 'This field is required';
        if (!loginData.password) newErrors.password = 'This field is required';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await apiClient.post('/login', loginData);
            const { token } = response.data; 
            login(token); 
            localStorage.setItem('username', loginData.UserName);
            alert('Login successfully');
            navigate('/Home'); 
            setLoginData({
                UserName: '',
                password: '',
            });
            setErrors({});
        } catch (error) {
            console.error('Error during login', error);
            alert('Error logging in user');
        }
    }

    return (
        <form onSubmit={handleSubmit}>
             <h2>Login/Signup</h2>
             <label>UserName</label><input name="UserName" value={loginData.UserName} onChange={handleChange} placeholder="UserName" autoComplete="User"/>
            {errors.UserName && <span>{errors.UserName}</span>}
            
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              placeholder="Password"
              autoComplete="current-password"
            />
        
            {errors.password && <span>{errors.password}</span>}

            <button type="submit">Login</button>
          


        </form>
    );
};

export default Login;
