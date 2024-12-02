import React, { useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CreateElection from './pages/CreateElection';
import Login from './components/LoginButton';
import NoMatch from './components/NoMatch';
import ThemeSwitcher from './components/theme-provider';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import Roompage from './pages/Roompage';
import VotingPage from './pages/VotingPage';
import ResultsPage from './pages/ResultsPage';

// Contexts to hold user data and login status


function App() {

  return (
    
    
      <BrowserRouter>
        {/* Provide the context to the entire app */}
        <ThemeSwitcher >
    <div className="min-h-screen">

         
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/create-election" element={<CreateElection />} />
              <Route path='/dashboard' element={<Dashboard></Dashboard> } />
              <Route path="*" element={<NoMatch />} />
              <Route path="/room/:electionId" element={<Roompage></Roompage>} />
              <Route path="/vote/:electionId" element={<VotingPage></VotingPage>} />
              <Route path="/results/:election_id" element={<ResultsPage />} />
              <Route path="/navbar" element={<Navbar />} />
            </Routes>
            </div>
      </ThemeSwitcher>
            
          
      </BrowserRouter>
      
  );
}

export default App;
