import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [login, setLogin] = useState(false);
  const [response, setResponse] = useState({});

  return (
    <AuthContext.Provider value={{ login, setLogin, response, setResponse }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);