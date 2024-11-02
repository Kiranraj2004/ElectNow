// src/pages/VotingPage.jsx
import React from 'react';

const VotingPage = () => {
   // This would typically be fetched from the server
   const options = ['Option 1', 'Option 2', 'Option 3'];

   const handleVote = (option) => {
      // Logic to submit the vote
      console.log(`Voting for: ${option}`);
   };

   return (
      <div>
         <h2>Vote Now!</h2>
         {options.map((option, index) => (
            <button key={index} onClick={() => handleVote(option)}>
               {option}
            </button>
         ))}
      </div>
   );
};

export default VotingPage;
