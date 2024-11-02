// src/pages/RoomEntry.jsx
import React, { useState } from 'react';

const RoomEntry = () => {
   const [roomCode, setRoomCode] = useState('');

   const handleJoinRoom = () => {
      // Logic to join the room with the provided code
      console.log(`Joining room: ${roomCode}`);
   };

   return (
      <div>
         <h2>Join Election Room</h2>
         <input
            type="text"
            placeholder="Room Code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
         />
         <button onClick={handleJoinRoom}>Join</button>
      </div>
   );
};

export default RoomEntry;
