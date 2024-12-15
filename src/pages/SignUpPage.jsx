import React, { useState } from 'react';
import api from "../middleware/api"
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    preferences: []
  });

  const handleSignup = async (e) => {
    e.preventDefault();

    if(formData.password != formData.confirmPassword){
        alert("Passwords must match")
    }    

    const finalData = {
        name:formData.name,
        email:formData.email,
        password:formData.password,
        isAdmin: false,
        preferences: []
    }

    await api.post("/api/users/register",finalData).then(response=>{
        localStorage.setItem("User",JSON.stringify(response.data))
        navigate('/')
    }).catch(err=>console.log(err))
    
  };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
    
            {/* {error && (
              <div className="mb-4 text-red-500 text-center text-sm">{error}</div>
            )} */}
    
            {/* {successMessage && (
              <div className="mb-4 text-green-500 text-center text-sm">
                {successMessage}
              </div>
            )}
     */}
            <form onSubmit={handleSignup} className="space-y-4">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={e=> setFormData({...formData,name:e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                  placeholder="Enter your name"
                  required
                />
              </div>
    
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={e=> setFormData({...formData,email:e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
    
              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={e=> setFormData({...formData,password:e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                  placeholder="Enter your password"
                  required
                />
              </div>
    
              {/* Confirm Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={e=> setFormData({...formData,confirmPassword:e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                  placeholder="Confirm your password"
                  required
                />
              </div>

              
    
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Sign Up
              </button>
            </form>
    
            {/* Login Link */}
            <div className="text-center mt-4 text-sm text-gray-500">
              Already have an account?{' '}
              <a href="/login" className="text-indigo-600 hover:underline">
                Login
              </a>
            </div>
          </div>
        </div>
      );

 
}
export default SignupPage;