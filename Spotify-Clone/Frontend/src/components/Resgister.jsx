import  { useState } from 'react';
import api from '../apis/auth.js'; // Your axios instance

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/register', formData);
            alert("Registration Successful!");
        } catch (error) {
            alert(error.response?.data?.message || "Registration Failed");
        }
    };

    return (
        <>
   
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-10m ">
            <input 
                className="border p-2" 
                placeholder="Username" 
                onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
            <input 
                className="border p-2" 
                type="email" 
                placeholder="Email" 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <input 
                className="border p-2" 
                type="password" 
                placeholder="Password" 
                onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <button type="submit" className="bg-blue-500 text-white p-2">Register</button>
        </form>
        </>
    );
};

export default Register;