import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ResultsPage() {
  const { roomCode } = useParams();
  const [results, setResults] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(roomCode));
    if (data) {
      // Tally votes
      const tally = data.positions.map((pos) => {
        const positionResults = {};
        pos.members.forEach((member) => {
          positionResults[member] = Object.values(data.votes).filter(v => v === member).length;
        });
        return { position: pos.position, results: positionResults };
      });
      setResults(tally);
    }
  }, [roomCode]);

  return results ? (
    <div>
      <h2>Results</h2>
      {results.map((pos, idx) => (
        <div key={idx}>
          <h3>{pos.position}</h3>
          {Object.entries(pos.results).map(([member, count], i) => (
            <p key={i}>{member}: {count} votes</p>
          ))}
        </div>
      ))}
    </div>
  ) : (
    <p>Loading results...</p>
  );
}

export default ResultsPage;
