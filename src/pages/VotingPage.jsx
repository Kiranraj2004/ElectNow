import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function VotingPage() {
  const { roomCode } = useParams();
  const [electionData, setElectionData] = useState(null);
  const [votes, setVotes] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(roomCode));
    if (data) setElectionData(data);
  }, [roomCode]);

  const handleVote = (position, member) => {
    setVotes((prevVotes) => ({ ...prevVotes, [position]: member }));
  };

  const handleSubmitVotes = () => {
    const data = { ...electionData };
    data.votes = { ...data.votes, ...votes }; // Update votes

    localStorage.setItem(roomCode, JSON.stringify(data)); // Save updated data to local storage

    alert("Thank you for voting!");
    navigate(`/results/${roomCode}`);
  };

  return electionData ? (
    <div>
      <h2>Vote for {electionData.name}</h2>
      {electionData.positions.map((pos, idx) => (
        <div key={idx}>
          <h3>{pos.position}</h3>
          {pos.members.map((member, i) => (
            <div key={i}>
              <input
                type="radio"
                name={pos.position}
                value={member}
                onChange={() => handleVote(pos.position, member)}
              />
              <label>{member}</label>
            </div>
          ))}
        </div>
      ))}
      <button onClick={handleSubmitVotes} className="bg-blue-500 text-white px-4 py-2 rounded-md">
        Submit Votes
      </button>
    </div>
  ) : (
    <p>Loading election data...</p>
  );
}

export default VotingPage;
