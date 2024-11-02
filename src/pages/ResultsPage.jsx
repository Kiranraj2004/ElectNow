// src/pages/ResultsPage.jsx
import React from 'react';

const ResultsPage = () => {
   // This data would typically come from the server
   const results = {
      'Option 1': 5,
      'Option 2': 3,
      'Option 3': 2,
   };

   return (
      <div>
         <h2>Election Results</h2>
         <ul>
            {Object.entries(results).map(([option, votes]) => (
               <li key={option}>
                  {option}: {votes} votes
               </li>
            ))}
         </ul>
      </div>
   );
};

export default ResultsPage;
s