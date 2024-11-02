import React, { useState } from 'react';

function CreateElection() {
  const [electionName, setElectionName] = useState('');
  const [description, setDescription] = useState('');
  const [positions, setPositions] = useState([
    { position: '', members: [''] }
  ]);

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
    const electionData = {
      name: electionName,
      description,
      positions
    };
    console.log('Election Created:', electionData);
    // You can send the electionData to the backend once you implement it
  };

  return (
    <div class="create-election">
  <h2 class="text-center text-3xl font-bold text-blue-500">Create Election</h2>
  <div class="flex flex-col space-y-2">
    <label class="text-gray-700">Election Name:</label>
    <input
      type="text"
      value={electionName}
      onChange={(e) => setElectionName(e.target.value)}
      class="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring focus:ring-blue-500"
    />
  </div>
  <div class="flex flex-col space-y-2 mt-4">
    <label class="text-gray-700">Description (optional):</label>
    <textarea
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      class="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring focus:ring-blue-500 h-24"
    />
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
    {positions.map((pos, posIdx) => (
      <div key={posIdx} class="position rounded-md border border-gray-300 p-4">
        <h3 class="text-lg font-medium">Position {posIdx + 1}</h3>
        <div class="flex flex-col space-y-2">
          <label class="text-gray-700">Position Name:</label>
          <input
            type="text"
            placeholder="Enter Position Name"
            value={pos.position}
            onChange={(e) => handleInputChange(e.target.value, posIdx)}
            class="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        {pos.members.map((member, memIdx) => (
          <div key={memIdx} class="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Enter Member Name"
              value={member}
              onChange={(e) => handleInputChange(e.target.value, posIdx, memIdx)}
              class="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring focus:ring-blue-500"
            />
            <button onClick={() => deleteMember(posIdx, memIdx)} class="bg-red-500 text-white rounded-md px-2 py-1">Delete</button>
          </div>
        ))}
        <button onClick={() => addMember(posIdx)} class="bg-green-500 text-white rounded-md px-2 py-1">Add Member</button>
        <button onClick={() => removePosition(posIdx)} class="bg-red-500 text-white rounded-md px-2 py-1">Remove Position</button>
      </div>
    ))}
  </div>

  <div class="flex justify-end mt-4">
    <button onClick={addPosition} class="bg-green-500 text-white rounded-md px-2 py-1">Add Another Position</button>
    <button onClick={handleSubmit} class="bg-blue-500 text-white rounded-md px-2 py-1 ml-2">Confirm Election</button>
  </div>
</div>
    
  );
}

export default CreateElection;
