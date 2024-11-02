// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './contextapi/AuthContext';
import './Navbar.css';
import { asset } from '../assets/asset';

const Navbar = () => {
  const { login, response, setLogin, setResponse } = useAuth();
  const handleLogout = () => {
    setLogin(false);
    setResponse({});
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>ElectNow</h1>
      </div>
      <div className="navbar-links">
      {!login ? (
        <Link to="/login">
          <button className="text-sm text-white-600 mt-1 hover:text-white-700 mr-5">Log In</button>
        </Link>
      ) : (
        <div className="user-profile flex items-center gap-3">
          {response.picture && (
            <img
              src={response.picture}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => {
                e.target.onerror = null; // Prevent infinite loop
               
                e.target.src = asset.googlelogo; // Add a default avatar image
              }}
            />
          )}
          <span className="text-sm font-medium">{response.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-white-600 hover:text-white-700 mr-5"
          >
            Logout
          </button>
        </div>
      )}
    </div>
    </nav>
  );
};

export default Navbar;