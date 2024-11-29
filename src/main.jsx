import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { Auth0Provider } from '@auth0/auth0-react';
// import dotenv from 'dotenv';

// dotenv.config();

const domin = import.meta.env.VITE_REACT_APP_DOMIN;// Using REACT_APP prefix for consistency
const clientId = import.meta.env.VITE_REACT_CLIENT_ID;
 // Assuming CLIENT_ID is the client ID for Auth0

createRoot(document.getElementById('root')).render(
  
    <Auth0Provider
      domain={domin} // Assuming DOMIN is the domain for Auth0
      clientId={clientId} 
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <App />
    </Auth0Provider>
  
);