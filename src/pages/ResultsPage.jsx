import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import { useAuth0 } from "@auth0/auth0-react";

const ResultsPage = () => {
  const { user, isLoading } = useAuth0();
  const navigate = useNavigate();
  const { election_id } = useParams();
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [electionData, setElectionData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isLoading) return; // Wait for Auth0 to finish loading
      if (!user) {
        navigate("/"); // Redirect to the landing page if user is not logged in
        return;
      } else {
        fetchElectionData();
      }
    };
    fetchUserData();
  }, [election_id, user, isLoading]);

  const fetchElectionData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("elections")
        .select(
          `
          name,
          total_votes,
          voting_deadline,
          created_by,
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
        throw new Error("Failed to fetch election data");
      }

      const resultsWithWinners = data.positions.map((position) => {
        const sortedMembers = [...position.members].sort(
          (a, b) => b.votes - a.votes
        );

        // Determine winners (handle ties)
        const maxVotes = sortedMembers[0]?.votes || 0;
        const winners = sortedMembers.filter((member) => member.votes === maxVotes);

        // Calculate unused votes
        const usedVotes = sortedMembers.reduce((sum, member) => sum + member.votes, 0);
        const unusedVotes = data.total_votes - usedVotes;

        return {
          ...position,
          winners,
          members: sortedMembers,
          unusedVotes: unusedVotes > 0 ? unusedVotes : 0,
        };
      });

      setResults(resultsWithWinners);
      setElectionData(data);
    } catch (err) {
      console.error("Error fetching election data:", err);
      setError("Failed to load election data.");
      setTimeout(() => {
        setError("");
      }, 300);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading results...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
        Election Name: {electionData.name}
      </h1>

      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
        Total Votes: {electionData.total_votes}
      </h1>

      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
        Election Results
      </h1>
      {results.map((position) => (
        <div key={position.id} className="mb-8 bg-white shadow-md rounded-lg p-6 dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
            {position.position_name}
          </h2>
          <div className="flex flex-col md:flex-row md:space-x-4">
            {/* List of members */}
            <div className="flex-1">
              <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-2">Candidates:</h3>
              <ul className="space-y-2">
                {position.members.map((member) => (
                  <li
                    key={member.id}
                    className={`flex justify-between p-2 rounded-lg ${
                      position.winners.some((winner) => winner.id === member.id)
                        ? "bg-green-100 dark:bg-green-800"
                        : ""
                    }`}
                  >
                    <span className="text-gray-800 dark:text-gray-200">
                      {member.member_name}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {member.votes} votes
                    </span>
                  </li>
                ))}
              </ul>
              {/* Display unused votes */}
              {position.unusedVotes > 0 && (
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  Unused Votes: {position.unusedVotes}
                </p>
              )}
            </div>

            {/* Winner details */}
            <div className="flex-1 mt-6 md:mt-0">
              <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-2">Winner(s):</h3>
              {position.winners.length > 0 ? (
                <div className="p-4 rounded-lg bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300">
                  {position.winners.map((winner) => (
                    <p key={winner.id} className="font-bold">
                      {winner.member_name} ({winner.votes} votes)
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No winner for this position.</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultsPage;
