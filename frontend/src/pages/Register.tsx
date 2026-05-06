import React, { useState } from 'react';
import API from '../api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', formData);
      alert('Account created! Now you can Sign In.');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Server Error - check if backend is awake');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-10">
      <h1 className="text-3xl font-bold mb-6">Create Account</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <input className="p-2 border rounded" type="text" placeholder="Full Name" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
        <input className="p-2 border rounded" type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        <input className="p-2 border rounded" type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
        <button className="bg-[#aa3bff] text-white p-2 rounded font-bold" type="submit">Create Account</button>
      </form>
    </div>
  );
};

export default Register;