import React, { useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CreateElection from './pages/CreateElection';
import Login from './components/LoginButton';
import NoMatch from './components/NoMatch';
import ThemeSwitcher from './components/theme-provider';
import Dashboard from './pages/Dashboard';

// Contexts to hold user data and login status


function App() {
  return (
    <ThemeSwitcher >
    <div className="min-h-screen">

    
      <BrowserRouter>
        {/* Provide the context to the entire app */}
         
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/create-election" element={<CreateElection />} />
              <Route path='/dashboard' element={<Dashboard></Dashboard> } />
              <Route path="*" element={<NoMatch />} />
            </Routes>
            
          
      </BrowserRouter>
      </div>
      </ThemeSwitcher>
  );
}

export default App;
