import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateElection() {
  const [electionName, setElectionName] = useState('');
  const [positions, setPositions] = useState([
    { position: '', members: [''] }
  ]);
  const [showConfirmation, setShowConfirmation] = useState(false); // For confirmation message
  const navigate = useNavigate();
  const[description, setDescription] = useState('');

  // Handle adding members for a specific position
  const addMember = (positionIndex) => {
    const newPositions = [...positions];
    newPositions[positionIndex].members.push('');
    setPositions(newPositions);
  };

  // Handle deleting a member
  const deleteMember = (positionIndex, memberIndex) => {
    const newPositions = [...positions];
    newPositions[positionIndex].members.splice(memberIndex, 1);
    setPositions(newPositions);
  };

  // Handle adding a new position
  const addPosition = () => {
    setPositions([...positions, { position: '', members: [''] }]);
  };

  // Handle removing a position
  const removePosition = (positionIndex) => {
    const newPositions = positions.filter((_, idx) => idx !== positionIndex);
    setPositions(newPositions);
  };

  // Handle input change for position or members
  const handleInputChange = (value, positionIndex, memberIndex = null) => {
    const newPositions = [...positions];
    if (memberIndex !== null) {
      newPositions[positionIndex].members[memberIndex] = value;
    } else {
      newPositions[positionIndex].position = value;
    }
    setPositions(newPositions);
  };

  // Submit function to create election
  const handleSubmit = () => {
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase(); // Generate a random 6-character code
    event.preventDefault(); 

  const electionData = {
    name: electionName,
    description,
    positions,
    roomCode,
    votes: {} // Initialize an empty votes object
  };

  // Save election data to local storage
  localStorage.setItem(roomCode, JSON.stringify(electionData));

  console.log('Election Created:', electionData);
  setShowConfirmation(true);

  setTimeout(() => setShowConfirmation(false), 3000);

  // Navigate to voting page and pass the room code
  navigate(`/room`); 
  };

  return (
    <div className="create-election">
       {showConfirmation && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white font-bold py-2 px-4 rounded-md shadow-md">
          Election created successfully!
        </div>
      )}
  <h2 className="text-center text-3xl font-bold text-blue-500">Create Election</h2>
  <div className="flex flex-col space-y-2 items-center">
    <label className="text-gray-700">Election Name:</label>
    <input
      type="text"
      value={electionName}
      onChange={(e) => setElectionName(e.target.value)}
      className=" rounded-md border border-gray-300 p-2 focus:outline-none focus:ring focus:ring-blue-500 w-96 placeholder:font-bold font-bold"
      placeholder='Enter a elecetion name'
    />
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
    {positions.map((pos, posIdx) => (
      <div key={posIdx} className="position rounded-md border border-gray-300 p-4">
        <h3 className="text-lg font-medium">Position {posIdx + 1}</h3>
        <div className="flex flex-col space-y-2 items-center">
          <label className="text-gray-700">Position Name:</label>
          <input
            type="text"
            placeholder="Enter Position Name"
            value={pos.position}
            onChange={(e) => handleInputChange(e.target.value, posIdx)}
            className="w-96 rounded-md border border-gray-300 p-2 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        {pos.members.map((member, memIdx) => (
          <div key={memIdx} className="flex items-center space-x-2 m-5">
            <input
              type="text"
              placeholder="Enter Member Name"
              value={member}
              onChange={(e) => handleInputChange(e.target.value, posIdx, memIdx)}
              className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring focus:ring-blue-500 placeholder:font-bold "
            />
            <button onClick={() => deleteMember(posIdx, memIdx)} className="bg-red-500 text-white rounded-md px-2 py-1">Delete</button>
          </div>
        ))}
        <button onClick={() => addMember(posIdx)} className="bg-green-500 text-white rounded-md px-2 py-1">Add Member</button>
        <button onClick={() => removePosition(posIdx)} className="bg-red-500 text-white rounded-md px-2 py-1">Remove Position</button>
      </div>
    ))}
  </div>

  <div className="flex justify-end mt-4">
    <button onClick={addPosition} className="bg-green-500 text-white rounded-md px-2 py-1">Add Another Position</button>
    <button onClick={handleSubmit} className="bg-blue-500 text-white rounded-md px-2 py-1 ml-2">Confirm Election</button>
   
  </div>
  <button onClick={()=>navigate('/')} className="bg-blue-500 text-white rounded-md px-2 py-1 ml-2">Go back</button>
</div>
    
  );
}

export default CreateElection;
