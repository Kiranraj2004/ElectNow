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

function CreateElection() {
  const [electionName, setElectionName] = useState("");
  const [positions, setPositions] = useState([
    { position: "", members: [{ name: "" }] },
  ]);
  const [issucess, setsucess] = useState(false);
  const[isLoading1, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const { user, isLoading } = useAuth0();

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
      setError("Election name cannot be empty.");
        setTimeout(function () {
      setError(""); // Clears the message after 3 seconds
    }, 3000);
      return false;
    }
    for (let pos of positions) {
      if (!pos.position.trim()) {
        setError("All positions must have a name.");
        setTimeout(function () {
          setError(""); // Clears the message after 3 seconds
        }, 3000);
        return false;
      }
      for (let member of pos.members) {
        if (!member.name.trim()) {
          setError("All members must have a name.");
          setTimeout(function () {
            setError(""); // Clears the message after 3 seconds
          }, 3000);
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

      setMessage("Loading recent elections...");
      const elections = await fetchRecentElections(user.email);
      setRecentElections(elections);
      setMessage("");
    };

    fetchUserData();
  }, [user, isLoading]);

  // Submit function
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!validateFields()) return;
  
    try {
      setLoading(true);
      // Insert election
      const currentDateTime = new Date();

      // Calculate the voting deadline
      const votingDeadline = new Date(
        currentDateTime.getTime() +
          days * 24 * 60 * 60 * 1000 + // Days to milliseconds
          hours * 60 * 60 * 1000 + // Hours to milliseconds
          minutes * 60 * 1000 // Minutes to milliseconds
      );
      const { data: electionData, error: electionError } = await supabase
        .from("elections")
        .insert([{ name: electionName, created_by: user.email ,voting_deadline: votingDeadline.toISOString(),  }])
        .select();
  
      if (electionError) {
        console.error("Error creating election:", electionError);
        return;
      }
  
      const electionId = electionData[0].id;
  
      // Insert positions and their members
      for (const pos of positions) {
        const { data: positionData, error: positionError } = await supabase
          .from("positions")
          .insert([{ election_id: electionId, position_name: pos.position }])
          .select();
  
        if (positionError) {
          console.error("Error creating position:", positionError);
          continue; // Skip to the next position if there's an error
        }
  
        const positionId = positionData[0].id;
  
        // Insert members for the position
        const memberInsertions = pos.members.map((member) =>
          supabase
            .from("members")
            .insert([{ position_id: positionId, member_name: member.name }])
        );
  
        const memberResults = await Promise.all(memberInsertions);
  
        // Check for any member insertion errors
        memberResults.forEach(({ error: memberError }, idx) => {
          if (memberError) {
            console.error(
              `Error creating member '${pos.members[idx].name}':`,
              memberError
            );
          }
        });
      }
      const { data: positionData, error: positionError } = await supabase
          .from("user_elections")
          .insert([{ user_email: user.email, election_id: electionId ,election_name: electionName}])
          .select();
  
        if (positionError) {
          console.error("Error creating position:", positionError);
          // Skip to the next position if there's an error
        }

  
      console.log("Election created successfully!");
          setError("Election created successfully");
          setsucess(true);
    setTimeout(function () {
      setError("");
      setsucess(true); // Clears the message after 3 seconds
    }, 3000);
    setLoading(false);
      navigate(`/room/${electionId}`);
    
    } catch (error) {
      console.error("Unexpected error creating election:", error);
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
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 p-4 rounded-md shadow-lg ${
                  issucess ? "bg-green-500" : "bg-red-500"
                } text-white font-bold`}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

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


            <div>
                    <h2>Set Voting Duration</h2>
                    <label >Days : </label>
                    <input
                      type="number"
                      placeholder="Days"
                     
                      onChange={(e) => setDays(Number(e.target.value))}
                      className="border p-2 rounded text-black"
                    />
                     <label >Hours: </label>
                    <input
                      type="number"
                      placeholder="Hours"
                      
                      onChange={(e) => setHours(Number(e.target.value))}
                      className="border p-2 rounded text-black"
                    />
                     <label >Minutes: </label>
                    <input
                      type="number"
                      placeholder="Minutes"
                      
                      onChange={(e) => setMinutes(Number(e.target.value))}
                      className="border p-2 rounded text-black"
                    />
                  </div>

            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className=" bg-black text-white dark:bg-white dark:text-black"  
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>


              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={addPosition}
                  className=" bg-black text-white dark:bg-white dark:text-black"  
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
