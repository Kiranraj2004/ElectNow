import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { Auth0Provider } from '@auth0/auth0-react';
// import dotenv from 'dotenv';

// dotenv.config();

// const domin = process.env.REACT_APP_DOMIN; // Using REACT_APP prefix for consistency
// const clientId = process.env.REACT_APP_CLIENT_ID;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      domain="dev-0boiw0q8u2mnllut.us.auth0.com" // Assuming DOMIN is the domain for Auth0
      clientId="pbxrdy1LnaFCWKx9hP4oIK8Udj2gt0QC"
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>,
);