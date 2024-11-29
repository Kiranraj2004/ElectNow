import React, { useState, useEffect } from "react";
import { useLocation, useNavigate , useParams} from "react-router-dom";
import { supabase } from "@/supabaseClient";


import { motion } from 'framer-motion'
import {  Vote } from 'lucide-react'
import {  ChevronLeft,  } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useAuth0 } from "@auth0/auth0-react";


function Roompage() {
  const navigate = useNavigate();
  const electionId = useParams();
  const election_id = electionId.electionId; // Extract the room code from the query parameter
  const [electionData, setElectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasVoted, setHasVoted] = useState(false); // State to track if the user has voted
  const { user, isLoading } = useAuth0();

  const [remainingTime, setRemainingTime] = useState("");
  const [votingEnded, setVotingEnded] = useState(false);
  
  useEffect(() => {
    if (isLoading) return; // Wait for Auth0 to finish loading

    if (!user || !user.email) {
      navigate("/"); // Redirect if not logged in
      return;
    }

    const initializeData = async () => {
      await fetchElectionData();
      await fetchVoteStatus();
      setLoading(false);
    };
    initializeData();

    // Start the interval to update the remaining time
    const interval = setInterval(() => {
      if (electionData?.voting_deadline) {
        updateRemainingTime(electionData.voting_deadline);
      }
    }, 1000);

    return () => clearInterval(interval); // Clear the interval on component unmount
  }, [election_id, user, isLoading, electionData?.voting_deadline]);

  const fetchVoteStatus = async () => {
    try {
      const { data, error } = await supabase
        .from("user_elections")
        .select("voted, election_id")
        .eq("election_id", election_id)
        .eq("user_email", user.email);

      if (error) {
        console.error("Query error:", error);
        return;
      }

      if (data.length === 0) {
        setHasVoted(false);
        return;
      }

      setHasVoted(data[0].voted);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const fetchElectionData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("elections")
        .select(
          `
          name,
          voting_deadline,
          created_by,
          positions (
            id,
            position_name,
            members (
              id,
              member_name
            )
          )
        `
        )
        .eq("id", election_id)
        .single();

      if (error) {
        throw new Error("Failed to fetch election data");
      }

      setElectionData(data);
      updateRemainingTime(data.voting_deadline);
    } catch (err) {
      console.error("Error fetching election data:", err);
      setError("Failed to load election data.");
    } finally {
      setLoading(false);
    }
  };

  const updateRemainingTime = (deadline) => {
    const now = new Date();
    const deadlineTime = new Date(deadline);
    const timeDiff = deadlineTime - now;

    if (timeDiff <= 0) {
      setRemainingTime("Voting has ended");
      setVotingEnded(true); // Mark voting as ended
    } else {
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      setRemainingTime(
        `${days}d ${hours}h ${minutes}m ${seconds}s`
      );
    }
  };
  

  const handleVoteRedirect = () => {
    navigate(`/vote/${election_id}`); // Redirect to the vote page with room code
  };

  if (loading) return <p>Loading election data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  

 

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900 p-4 sm:p-6 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400">
            ElectionName :  
            {electionData?.name}
          </CardTitle>
        </CardHeader>
        <h3 className="text-center">Time Left to Vote: {remainingTime}</h3>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {electionData?.positions.map((position) => (
              <Card key={position.id} className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
                <CardHeader className="bg-blue-50 dark:bg-blue-900">
                  <CardTitle className="text-xl font-semibold">
                    {position.position_name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="mt-2 space-y-2">
                    {position.members.map((member) => (
                      <li 
                        key={member.id}
                        className="text-lg font-medium p-2 bg-gray-100 dark:bg-gray-800 rounded-md transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        {member.member_name}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
          <Button
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className=" bg-black text-white dark:bg-white dark:text-black"  
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>




              <Button 
              onClick={handleVoteRedirect}
              size="lg"
              className="bg-blue-500 ml-3 hover:bg-blue-600 text-white transition-colors duration-300"
              disabled={hasVoted||votingEnded} // Disable the button if the user has voted
            >
              <Vote className="mr-2 h-5 w-5" />
              Cast Your Vote
            </Button>




            <Button 
            variant="outline"
              onClick={()=>navigate(`/results/${election_id}`)}
              size="lg"
              disabled={!votingEnded} 
              className="bg-blue-500 ml-3 hover:bg-blue-600 text-white transition-colors duration-300"
            >
              View result
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}

export default Roompage;

