import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RoomCodeEntry() {
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    // Check if the room code exists
    const electionData = localStorage.getItem(roomCode);
    if (electionData) {
      navigate(`/vote/${roomCode}`);
    } else {
      alert('Invalid room code');
    }
  };

  return (
    <div>
      <h2>Enter Room Code</h2>
      <input
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
        placeholder="Enter Room Code"
        className="border p-2 rounded-md"
      />
      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded-md">
        Enter
      </button>
    </div>
  );
}

export default RoomCodeEntry;
