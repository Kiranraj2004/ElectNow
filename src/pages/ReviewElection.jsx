import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function ReviewElection() {
  const location = useLocation();
  const navigate = useNavigate();
  const { electionData } = location.state;

  return (
    <div className="review-election">
      <h2 className="text-center text-3xl font-bold text-blue-500">Review Election Details</h2>
      
      <div className="election-summary mt-4">
        <p className="font-bold">Election Name:</p>
        <p>{electionData.name}</p>
        
        {electionData.description && (
          <>
            <p className="font-bold mt-2">Description:</p>
            <p>{electionData.description}</p>
          </>
        )}

        <div className="positions-summary mt-4">
          <h3 className="text-xl font-semibold">Positions</h3>
          {electionData.positions.map((pos, index) => (
            <div key={index} className="position-summary mt-2">
              <p className="font-bold">Position {index + 1}: {pos.position}</p>
              <p>Members:</p>
              <ul className="list-disc list-inside">
                {pos.members.map((member, idx) => (
                  <li key={idx}>{member}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-end space-x-2">
        <button onClick={() => navigate(-1)} className="bg-gray-500 text-white rounded-md px-4 py-2">Back</button>
        <button onClick={() => handleConfirmElection(electionData)} className="bg-blue-500 text-white rounded-md px-4 py-2">Confirm</button>
      </div>
    </div>
  );
}

const handleConfirmElection = (electionData) => {
  console.log("Final Election Data:", electionData);
  alert("Election successfully created!");
  // Here you can proceed with sending data to the backend or any final confirmation logic
};

export default ReviewElection;
