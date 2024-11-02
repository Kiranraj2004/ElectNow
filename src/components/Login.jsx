import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from './contextapi/AuthContext';
import axios from 'axios';
import { asset } from '../assets/asset';
function Login() {
  const navigate = useNavigate();
  const { setLogin, setResponse } = useAuth();

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        // Update the auth context
        setResponse(userInfo.data);
        setLogin(true);

        // Navigate to home page or dashboard
        navigate('/');
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    },
    onError: () => {
      console.log('Google login failed');
    },
  });


 
  return (
    <>  
      <div className="bg-[#E5E7F8] flex items-center justify-center min-h-screen">
        <div className="bg-white p-5 rounded-lg shadow-md w-full max-w-md">
          <div className="flex items-center justify-between">
            <div className="text-blue-600 text-2xl font-bold">ElectNow</div>
            {/* Go back button */}
            <img
              src={asset.gobacklogo}
              alt="Go Back"
              className="w-4 cursor-pointer"
              onClick={() => navigate(-1)}
            />
          </div>

          <h2 className="text-3xl font-semibold mb-2 mt-4">Login</h2>
          <p className="text-gray-600 mb-4">Hi, Welcome back 👋</p>

          {/* Google Login Button */}
          <button
            className="w-full flex items-center justify-center bg-white border-2 border-solid border-black-700	text-gray-600 py-2  mb-4 hover:bg-gray-100 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            onClick={loginWithGoogle}
          >
            <img src={asset.googlelogo} alt="Google Logo" className="w-10 mr-2" />
            Login with Google
          </button>
          <div className="text-center text-gray-500 mb-4">or Login with Email (*coming soon)</div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-400"
              type="email"
              id="email"
              placeholder="E.g. johndoe@gmail.com"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
            <div className="relative">
              <input
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-400"
                type="password"
                id="password"
                placeholder="Enter your password"
              />
              <i className="fas fa-eye absolute right-3 top-3 text-gray-500"></i>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox text-blue-600" />
              <span className="ml-2 text-gray-700">Remember Me</span>
            </label>
            <a href="#" className="text-blue-600">Forgot Password?</a>
          </div>

          <button className="w-full bg-blue-600 text-white py-2 rounded-lg">
            Login
          </button>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Not registered yet? <a href="#" className="text-blue-600">Create an account</a> <i className="fas fa-arrow-right"></i>
            </p>
          </div>
        </div>
      </div>
      </>
  );
}

export default Login;
