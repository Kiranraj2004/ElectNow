import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/supabaseClient";

const ResultsPage = () => {
  const { election_id } = useParams(); // Election ID from the route
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data, error } = await supabase
          .from("positions")
          .select(
            `
            id,
            position_name,
            members (
              id,
              member_name,
              votes
            )
          `
          )
          .eq("election_id", election_id);

        if (error) {
          console.error("Error fetching results:", error);
          setError("Failed to load election results.");
        } else {
          // Sort members by vote count within each position
          const resultsWithWinners = data.map((position) => {
            const sortedMembers = [...position.members].sort(
              (a, b) => b.votes - a.votes
            );

            const winner =
              sortedMembers[0]?.votes > 0 ? sortedMembers[0] : null;

            return { ...position, winner, members: sortedMembers };
          });

          setResults(resultsWithWinners);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred while loading results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [election_id]);

  if (loading) return <p>Loading results...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
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
                      position.winner?.id === member.id ? "bg-green-100 dark:bg-green-800" : ""
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
            </div>

            {/* Winner details */}
            <div className="flex-1 mt-6 md:mt-0">
              <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-2">Winner:</h3>
              {position.winner ? (
                <div className="p-4 rounded-lg bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300">
                  <p className="font-bold">
                    {position.winner.member_name}
                  </p>
                  <p>{position.winner.votes} votes</p>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No winner for this position.
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultsPage;
