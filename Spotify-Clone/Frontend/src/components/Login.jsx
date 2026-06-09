import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../apis/auth.js'; 

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Note: Your backend login route usually expects username/password
            const response = await api.post('/login', formData);
            alert("Login Successful!");
            navigate('/'); // Redirect to Home/Feed page after login
        } catch (error) {
            alert(error.response?.data?.message || "Login Failed");
        }
    };

    return (
        <form 
            onSubmit={handleSubmit} 
            className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg border border-gray-200"
        >
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
            
            <div className="flex flex-col gap-4">
                <input 
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Username" 
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
                <input 
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="password" 
                    placeholder="Password" 
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-md transition duration-200 font-semibold"
                >
                    Sign In
                </button>
            </div>
        </form>
    );
};

export default Login;