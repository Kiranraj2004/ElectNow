import React, { useState,useEffect   } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import { useAuth0 } from '@auth0/auth0-react';

import { Plus, Minus, Trash2, ChevronLeft, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Toast from "@/components/Toast";

function CreateElection() {
  const [electionName, setElectionName] = useState("");
  const [positions, setPositions] = useState([
    { position: "", members: [{ name: "" }] },
  ]);

  const[isLoading1, setLoading] = useState(false);

  const navigate = useNavigate();

  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const { user, isLoading } = useAuth0();

  const [message, setMessage] = useState("");
const [messageType, setMessageType] = useState(""); // 'success' or 'error'


  // Handle adding a new member
  const addMember = (positionIndex) => {
    const newPositions = [...positions];
    newPositions[positionIndex].members.push({ name: "" });
    setPositions(newPositions);
  };

  // Handle deleting a member
  const deleteMember = (positionIndex, memberIndex) => {
    const newPositions = [...positions];
    newPositions[positionIndex].members.splice(memberIndex, 1);
    setPositions(newPositions);
  };

  // Handle adding a new position
  const addPosition = () => {
    setPositions([...positions, { position: "", members: [{ name: "" }] }]);
  };

  // Handle removing a position
  const removePosition = (positionIndex) => {
    const newPositions = positions.filter((_, idx) => idx !== positionIndex);
    setPositions(newPositions);
  };

  // Handle input change for position or member
  const handleInputChange = (value, positionIndex, memberIndex = null) => {
    const newPositions = [...positions];
    if (memberIndex !== null) {
      newPositions[positionIndex].members[memberIndex].name = value;
    } else {
      newPositions[positionIndex].position = value;
    }
    setPositions(newPositions);
  };

  // Form validation
 const validateFields = () => {
  if (!electionName.trim()) {
    setMessage("Election name cannot be empty.");
    setMessageType("error");
    setTimeout(() => setMessage(""), 3000); // Clears the message after 3 seconds
    return false;
  }

  for (let pos of positions) {
    if (!pos.position.trim()) {
      setMessage("All positions must have a name.");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
      return false;
    }
    for (let member of pos.members) {
      if (!member.name.trim()) {
        setMessage("All members must have a name.");
        setMessageType("error");
        setTimeout(() => setMessage(""), 3000);
        return false;
      }
    }
  }

  return true;
};


  useEffect(() => {
    const fetchUserData = async () => {
      if (isLoading) return; // Wait until Auth0 finishes loading
      if (!user || !user.email) {
        navigate("/"); // Redirect to the landing page if user is not logged in
        return;
      }

        
    };

    fetchUserData();
  }, [user, isLoading]);

  // Submit function
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!validateFields()) return;
  
    try {
      setLoading(true);
      const currentDateTime = new Date();
      const votingDeadline = new Date(
        currentDateTime.getTime() +
          days * 24 * 60 * 60 * 1000 +
          hours * 60 * 60 * 1000 +
          minutes * 60 * 1000
      );
  
      const { data: electionData, error: electionError } = await supabase
        .from("elections")
        .insert([{ name: electionName, created_by: user.email, voting_deadline: votingDeadline.toISOString() }])
        .select();
  
      if (electionError) {
        console.error("Error creating election:", electionError);
        setMessage("Failed to create the election. Try again.");
        setMessageType("error");
        setTimeout(() => setMessage(""), 3000);
        return;
      }
  
      const electionId = electionData[0].id;
  
      for (const pos of positions) {
        const { data: positionData, error: positionError } = await supabase
          .from("positions")
          .insert([{ election_id: electionId, position_name: pos.position }])
          .select();
  
        if (positionError) {
          console.error("Error creating position:", positionError);
          continue;
        }
  
        const positionId = positionData[0].id;
  
        const memberInsertions = pos.members.map((member) =>
          supabase.from("members").insert([{ position_id: positionId, member_name: member.name }])
        );
  
        const memberResults = await Promise.all(memberInsertions);
  
        memberResults.forEach(({ error: memberError }, idx) => {
          if (memberError) {
            console.error(`Error creating member '${pos.members[idx].name}':`, memberError);
          }
        });
      }
  
      await supabase
        .from("user_elections")
        .insert([{ user_email: user.email, election_id: electionId, election_name: electionName }]);
  
      setMessage("Election created successfully!");
      setMessageType("success");
      setTimeout(() => setMessage(""), 3000);
  
      setLoading(false);
      navigate(`/room/${electionId}`);
    } catch (error) {
      console.error("Unexpected error creating election:", error);
      setMessage("An unexpected error occurred.");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
    }
  };
  
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900 p-4 sm:p-6 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400">
            Create Election
          </CardTitle>
        </CardHeader>
        <CardContent>
        <Toast message={message} type={messageType} />


          <div className="space-y-6">
            <div>
              <Label htmlFor="electionName">Election Name</Label>
              <Input
                id="electionName"
                value={electionName}
                onChange={(e) => setElectionName(e.target.value)}
                placeholder="Enter an election name"
                className="mt-1"
              />
            </div>

            <div className="space-y-4">
              {positions.map((pos, posIdx) => (
                <Card key={posIdx} className="overflow-hidden">
                  <CardHeader className="bg-blue-50 dark:bg-blue-900">
                    <CardTitle className="text-lg font-medium flex justify-between items-center">
                      Position {posIdx + 1}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-red-500"
                        onClick={() => removePosition(posIdx)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor={`position-${posIdx}`}>Position Name</Label>
                      <Input
                        id={`position-${posIdx}`}
                        value={pos.position}
                        onChange={(e) => handleInputChange(e.target.value, posIdx)}
                        placeholder="Enter Position Name"
                        className="mt-1"
                      />
                    </div>
                    <div className="space-y-2">
                      {pos.members.map((member, memIdx) => (
                        <div key={memIdx} className="flex items-center space-x-2">
                          <Input
                            value={member.name}
                            onChange={(e) => handleInputChange(e.target.value, posIdx, memIdx)}
                            placeholder="Enter Member Name"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="bg-red-500"
                            onClick={() => deleteMember(posIdx, memIdx)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addMember(posIdx)}
                      className=" bg-black text-white dark:bg-white dark:text-black"  
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Member
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <h2>Set Voting Duration</h2>


            <div className="flex flex-row justify-around ">
                   
                    <label  className="mt-1">Days : </label>
                    <input
                      type="number"
                      placeholder="Days"
                     
                      onChange={(e) => setDays(Number(e.target.value))}
                      className="border p-2 rounded text-black"
                    />
                     <label className="mt-1">Hours: </label>
                    <input
                      type="number"
                      placeholder="Hours"
                      
                      onChange={(e) => setHours(Number(e.target.value))}
                      className="border p-2 rounded text-black"
                    />
                     <label className="mt-1">Minutes: </label>
                    <input
                      type="number"
                      placeholder="Minutes"
                      
                      onChange={(e) => setMinutes(Number(e.target.value))}
                      className="border p-2 rounded text-black"
                    />
                  </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className=" bg-black text-white dark:bg-white dark:text-black"  
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>


              <div className="">
                <Button
                  variant="outline"
                  onClick={addPosition}
                  className=" bg-black text-white dark:bg-white dark:text-black mr-4"  
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Position
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading1}
                >
                  {isLoading1 ? (
                    <motion.div
                      className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin"
                    />
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Confirm Election
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateElection;
