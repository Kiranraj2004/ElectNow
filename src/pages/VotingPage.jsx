import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient"; // Adjust this path to your Supabase setup
import { useAuth0 } from "@auth0/auth0-react";

const VotingPage = () => {
  const electionId = useParams()
  const election_id=electionId.electionId // Extract the election_id from the URL
  const navigate = useNavigate();
  const [electionData, setElectionData] = useState(null);
  const [selectedVotes, setSelectedVotes] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth0();

  useEffect(() => {
    const fetchElectionData = async () => {
      try {
        console.log(election_id);
        const { data, error } = await supabase
          .from("elections")
          .select(
            `
           name,
           total_votes,
          positions (
            id,
            position_name,
            members (
              id,
              member_name,
              votes
            )
          )
          `
          )
          .eq("id", election_id)
          .single();

        if (error) {
          console.error("Error fetching election data:", error);
          setError("Failed to load election data.");
          setLoading(false);
          return;
        }

        setElectionData(data);
        setLoading(false);
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("Unexpected error occurred.");
        setLoading(false);
      }
    };

    fetchElectionData();
  }, [election_id]);

  const handleVoteChange = (positionId, memberId) => {
    setSelectedVotes((prevVotes) => ({
      ...prevVotes,
      [positionId]: prevVotes[positionId] === memberId ? null : memberId,
    }));
  };

  const handleSubmitVotes = async () => {
    try {
      for (const positionId in selectedVotes) {
        const memberId = selectedVotes[positionId];
  
        if (memberId) {
          // Call the increment_vote RPC function
          const { error } = await supabase.rpc("increment_vote", {
            member_id: memberId,
          });
  
          if (error) {
            console.error(`Failed to update vote for member ${memberId}:`, error);
            setError("Failed to submit your vote. Please try again.");
            return;
          }
        }
      }

      
      try {
        const { data: updatedData, error: updateError } = await supabase
          .from('elections')
          .update({ total_votes: electionData.total_votes + 1 })
          .eq('id', election_id)
          .select();
      
        if (updateError) {
          console.error('Error updating total votes:', updateError);
        } else {
          console.log('Updated data:', updatedData);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      }
      
      
        const { data, error } = await supabase
        .from('user_elections')
        .update({ voted: true})
        .eq('user_email',user.email )
        .eq('election_id',election_id)
        .select()

        if (error) {
          console.error(`Failed to update vote for member :`, error);
          setError("Failed to submit your vote. Please try again.");
          return;
        }

        
  
      alert("Your vote has been submitted successfully!");
      navigate("/dashboard"); // Redirect to the dashboard after voting
    } catch (err) {
      console.error("Error submitting votes:", err);
      setError("Unexpected error occurred while submitting votes.");
    }
  };
  
  

  if (loading) return <p>Loading election data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">{electionData.name}</h1>
      <div className="space-y-6">
        {electionData.positions.map((position) => (
          <div key={position.id} className="p-4 border rounded-md">
            <h2 className="text-xl font-semibold mb-2">{position.position_name}</h2>
            <div className="space-y-2">
              {position.members.map((member) => (
                <div key={member.id} className="flex items-center space-x-4">
                  <input
                    type="radio"
                    name={`position-${position.id}`}
                    id={`member-${member.id}`}
                    checked={selectedVotes[position.id] === member.id}
                    onChange={() => handleVoteChange(position.id, member.id)}
                  />
                  <label htmlFor={`member-${member.id}`}>{member.member_name}</label>
                </div>
              ))}
              <div className="flex items-center space-x-4">
                <input
                  type="radio"
                  name={`position-${position.id}`}
                  id={`none-${position.id}`}
                  checked={selectedVotes[position.id] === null}
                  onChange={() => handleVoteChange(position.id, null)}
                />
                <label htmlFor={`none-${position.id}`}>None</label>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-md"
        onClick={handleSubmitVotes}
      >
        Submit Vote
      </button>
    </div>
  );
};

export default VotingPage;
