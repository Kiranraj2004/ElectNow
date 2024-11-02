// src/pages/LandingPage.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar'; 

const LandingPage = () => {
// Use correct context name// Check the value in the console
  return (
    <div>
      <Navbar />
      <h1>Welcome to ElectNow!</h1>
      <p>Create and participate in custom elections easily.</p>
      <Link to="/create-election">Create an Election</Link>
    </div>
  );
};

export default LandingPage;
