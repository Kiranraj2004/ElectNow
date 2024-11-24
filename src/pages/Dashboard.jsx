import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthButton from "@/components/LoginButton";

const Dashboard = () => {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");
  const [message, setMessage] = useState("");
  
  const handleRoomCodeSubmit = () => {
    // Simulate API call to check room code status
    if (!roomCode) {
      setMessage("Please enter a room code.");
      return;
    }
    const mockRoomData = {
      status: "voting", // Options: 'voting', 'results'
    };

    if (mockRoomData.status === "results") {
      navigate(`/results/${roomCode}`); // Redirect to results page
    } else if (mockRoomData.status === "voting") {
      navigate(`/vote/${roomCode}`); // Redirect to voting page
    } else {
      setMessage("Invalid room code.");
    }
  };

  return (
    <div className="min-h-screen  transition-colors duration-300 p-4">
        <div className="flex flex-row justify-end mr-14 mt-7">
            <AuthButton></AuthButton>
        </div>
        

        <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Dashboard</h1>
      <div className="mb-6">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => navigate("/create-election")}
        >
          Create Election
        </button>
      </div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Enter Room Code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          className="border px-5 py-2 rounded-md w-64 font-bold dark:text-black"
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-md ml-4"
          onClick={handleRoomCodeSubmit}
        >
          Submit
        </button>
      </div>
      {message && <p className="text-red-500">{message}</p>}
    </div>
    </div>
  );
};

export default Dashboard;
