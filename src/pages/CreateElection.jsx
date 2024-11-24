import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateElection() {
  const [electionName, setElectionName] = useState("");
  const [positions, setPositions] = useState([
    { position: "", members: [{ name: "", votes: 0 }] },
  ]);
  const [showConfirmation, setShowConfirmation] = useState(false); // For confirmation message
  const [description, setDescription] = useState(""); // Optional description field
  const navigate = useNavigate();

  // Handle adding members for a specific position
  const addMember = (positionIndex) => {
    const newPositions = [...positions];
    newPositions[positionIndex].members.push({ name: "", votes: 0 });
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
    setPositions([...positions, { position: "", members: [{ name: "", votes: 0 }] }]);
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
      newPositions[positionIndex].members[memberIndex].name = value;
    } else {
      newPositions[positionIndex].position = value;
    }
    setPositions(newPositions);
  };

  // Validate form fields
  const validateFields = () => {
    if (!electionName.trim()) {
      alert("Election name cannot be empty.");
      return false;
    }

    for (let pos of positions) {
      if (!pos.position.trim()) {
        alert("All positions must have a name.");
        return false;
      }
      for (let member of pos.members) {
        if (!member.name.trim()) {
          alert("All members must have a name.");
          return false;
        }
      }
    }
    return true;
  };

  // Submit function to create election
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateFields()) return;

    const electionData = {
      name: electionName,
      description,
      positions,
    };

    // Log election data (replace with API call to save data)
    console.log("Election Created:", electionData);

    // Show confirmation
    setShowConfirmation(true);

    // Reset form fields after confirmation
    setTimeout(() => {
      setShowConfirmation(false);
    }, 4000);
  };

  return (
    <div className="create-election p-3 text-black dark:text-white">
      {showConfirmation && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white font-bold py-2 px-4 rounded-md shadow-md">
          Election created successfully!
        </div>
      )}
      <h2 className="text-center text-3xl mt-2 font-bold text-blue-500">Create Election</h2>

      {/* Election Name Input */}
      <div className="flex flex-col space-y-2 items-center">
        <label className="font-bold mt-6">Election Name:</label>
        <input
          type="text"
          value={electionName}
          onChange={(e) => setElectionName(e.target.value)}
          className="rounded-md border p-2 focus:outline-none focus:ring focus:ring-blue-500 w-96 text-black font-bold placeholder:font-bold"
          placeholder="Enter an election name"
        />
      </div>

      {/* Positions and Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        {positions.map((pos, posIdx) => (
          <div key={posIdx} className="position rounded-md border border-gray-300 p-4">
            <h3 className="text-lg font-medium">Position {posIdx + 1}</h3>
            <div className="flex flex-col space-y-2 items-center">
              <label className="">Position Name:</label>
              <input
                type="text"
                placeholder="Enter Position Name"
                value={pos.position}
                onChange={(e) => handleInputChange(e.target.value, posIdx)}
                className="w-96 rounded-md border border-gray-300 p-2 font-semibold text-black focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>
            {pos.members.map((member, memIdx) => (
              <div key={memIdx} className="flex items-center space-x-2 m-5">
                <input
                  type="text"
                  placeholder="Enter Member Name"
                  value={member.name}
                  onChange={(e) => handleInputChange(e.target.value, posIdx, memIdx)}
                  className="w-full rounded-md border text-black border-gray-300 p-2 focus:outline-none focus:ring focus:ring-blue-500 placeholder:font-bold"
                />
                <button
                  onClick={() => deleteMember(posIdx, memIdx)}
                  className="bg-red-500 text-white rounded-md px-2 py-1"
                >
                  Delete
                </button>
              </div>
            ))}
            <button
              onClick={() => addMember(posIdx)}
              className="bg-green-500 text-white rounded-md px-2 py-1"
            >
              Add Member
            </button>
            <button
              onClick={() => removePosition(posIdx)}
              className="bg-red-500 text-white rounded-md px-2 py-1"
            >
              Remove Position
            </button>
          </div>
        ))}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end mt-4">
        <button
          onClick={addPosition}
          className="bg-green-500 text-white rounded-md px-2 py-1"
        >
          Add Another Position
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white rounded-md px-2 py-1 ml-2"
        >
          Confirm Election
        </button>
      </div>
      <button
        onClick={() => navigate("/dashboard")}
        className="bg-blue-500 text-white rounded-md px-2 py-1 ml-2"
      >
        Go back
      </button>
    </div>
  );
}

export default CreateElection;
