import React, { useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LandingPage from './pages/LandingPage';
import CreateElection from './pages/CreateElection';
import RoomEntry from './pages/RoomEntry';
import VotingPage from './pages/VotingPage';
import Login from './components/Login';
import NoMatch from './components/NoMatch';
import Navbar from './components/Navbar';
import { AuthProvider } from './components/contextapi/AuthContext';

// Contexts to hold user data and login status


function App() {
  return (
    <GoogleOAuthProvider clientId="658220532149-f8h392h9sj7m9ak2j4uk9aqulhcqu5tq.apps.googleusercontent.com">
      <BrowserRouter>
        {/* Provide the context to the entire app */}
          <AuthProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/create-election" element={<CreateElection />} />
              <Route path="/room-entry" element={<RoomEntry />} />
              <Route path="/vote/:roomId" element={<VotingPage />} />
              <Route 
                path="/login" 
                element={<Login/>} 
              />
              <Route path="*" element={<NoMatch />} />
            </Routes>
            </AuthProvider>
          
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
