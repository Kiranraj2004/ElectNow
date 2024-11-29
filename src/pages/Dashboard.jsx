import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AuthButton from "@/components/LoginButton";
import { supabase } from "@/supabaseClient";
import { useAuth0 } from "@auth0/auth0-react";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Plus, ArrowRight, History } from 'lucide-react'

const Dashboard = () => {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");
  const [message, setMessage] = useState("");
  const [recentElections, setRecentElections] = useState([]);
  const { user, isLoading } = useAuth0();

  const fetchRecentElections = async (email) => {
    const { data, error } = await supabase
      .from("user_elections")
      .select("*")
      .eq("user_email", email)
      .order("joined_at", { ascending: false })
      .limit(5);

    if (error) {
      console.error("Error fetching recent elections:", error);
      setMessage("Failed to fetch recent elections.");
      setTimeout(() => setMessage(""), 3000);
      return [];
    }

    return data;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (isLoading) return; // Wait until Auth0 finishes loading
      if (!user || !user.email) {
        navigate("/"); // Redirect to the landing page if user is not logged in
        return;
      }

      setMessage("Loading recent elections...");
      const elections = await fetchRecentElections(user.email);
      setRecentElections(elections);
      setMessage("");
    };

    fetchUserData();
  }, [user, isLoading]);

  const handleRoomCodeSubmit = async () => {
    try {
      if (!user || !user.email) {
        setMessage("You need to log in to access this feature.");
        setTimeout(() => setMessage(""), 3000);
        navigate("/");
        return;
      }

      const { data: election, error } = await supabase
        .from("elections")
        .select("id, name")
        .eq("id", roomCode)
        .single();

      if (error) {
        setMessage("Invalid Room Code. Please try again.");
        setTimeout(() => setMessage(""), 3000);
        return;
      }

      const { data: existingEntry } = await supabase
        .from("user_elections")
        .select("*")
        .eq("user_email", user.email)
        .eq("election_id", roomCode)
        .single();

      if (!existingEntry) {
        await supabase.from("user_elections").insert({
          user_email: user.email,
          election_id: roomCode,
          election_name: election.name,
        });
      }

      const updatedElections = await fetchRecentElections(user.email);
      setRecentElections(updatedElections);

      navigate(`/room/${roomCode}`);
    } catch (err) {
      console.error("Unexpected error:", err);
      setMessage("An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900   transition-colors duration-300">
      <div className="absolute" />
      <div className="">
        <header className="p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold dark:text-white ">ElectNow</h1>
          <div className="flex items-center space-x-4 mt-7">
            <AuthButton />
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {message && (
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
              <p className="bg-red-500 text-white px-4 py-2 rounded-md shadow-lg">
                {message}
              </p>
            </div>
          )}

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Welcome to the Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
              <Button onClick={() => navigate("/create-election")} className="w-full md:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Create Election
              </Button>
              <div className="flex w-full md:w-auto space-x-2">
                <Input
                  type="text"
                  placeholder="Enter Room Code"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  className="w-full md:w-64"
                />
                <Button onClick={handleRoomCodeSubmit}>
                  <ArrowRight className="mr-2 h-4 w-4" /> Join
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="mr-2 h-5 w-5" /> Recently Visited Elections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentElections.map((election, id) => (
                  <li
                    key={id}
                    className="py-3 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 rounded-md px-2"
                    onClick={() => navigate(`/room/${election.election_id}`)}
                  >
                    <span className="font-medium">{election.election_name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Election code : {election.election_id}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
};

export default Dashboard;
