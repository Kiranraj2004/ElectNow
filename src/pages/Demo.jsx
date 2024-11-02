import React from 'react';  // Context definitions
import LandingPage from './LandingPage';
export const UserContext=React  .createContext();
export const ChannelContext=React.createContext();
function Demo({ children }) {
  return (
    <UserContext.Provider value={'kiran'}>
      <ChannelContext.Provider value={'1nh22ai075'}>
        {/* {children}  This will render the nested routes/components */}
        <LandingPage></LandingPage>
      </ChannelContext.Provider>
    </UserContext.Provider>
  );
}

export default Demo;
