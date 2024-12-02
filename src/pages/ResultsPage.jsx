import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";
import { useAuth0 } from "@auth0/auth0-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, Users, Calendar, CheckCircle2 } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {  ChevronLeft,  } from 'lucide-react';

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
      if (isLoading) return;
      if (!user) {
        navigate("/");
        return;
      } else {
        fetchElectionData();
      }
    };
    fetchUserData();
    
  }, [election_id, user, isLoading, navigate]);

  const updateRemainingTime = (deadline) => {
    const now = new Date();
    
    const deadlineTime = new Date(deadline);
    console.log(deadlineTime)
    const timeDiff = deadlineTime - now;
    console.log(timeDiff);

    if (timeDiff > 0) {
     
      setError("still voting in going on ")
      
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

        const maxVotes = sortedMembers[0]?.votes || 0;
        const winners = sortedMembers.filter((member) => member.votes === maxVotes);

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
      updateRemainingTime(data.voting_deadline);
    } catch (err) {
      console.error("Error fetching election data:", err);
      setError("Failed to load election data.");
      
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
        <Skeleton className="h-8 w-1/2 mx-auto mb-6" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
          <Button
                variant="outline"
                onClick={()=>{navigate(`/dashboard`)}}
                className=" bg-black text-white dark:bg-white dark:text-black"  
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>

        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900 p-4 sm:p-6 md:p-8 ">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">{electionData.name}</CardTitle>
          <div className="flex justify-center space-x-4 mt-2">
            <Badge variant="secondary" className="text-sm flex items-center">
              <Users className="mr-1 h-4 w-4" />
              {electionData.total_votes} Total Votes
            </Badge>
            <Badge variant="secondary" className="text-sm flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              Deadline: {new Date(electionData.voting_deadline).toLocaleDateString()}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue={results[0]?.id}>
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {results.map((position) => (
            <TabsTrigger key={position.id} value={position.id} className="text-sm">
              {position.position_name}
            </TabsTrigger>
          ))}
        </TabsList>
        {results.map((position) => (
          <TabsContent key={position.id} value={position.id}>
            <Card>
              <CardHeader>
                <CardTitle>{position.position_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Candidates</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[300px] pr-4">
                        {position.members.map((member) => (
                          <div key={member.id} className="mb-4">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium">{member.member_name}</span>
                              <Badge variant={position.winners.some(w => w.id === member.id) ? "default" : "secondary"}>
                                {member.votes} votes
                              </Badge>
                            </div>
                            <Progress 
                              value={(member.votes / electionData.total_votes) * 100} 
                              className="h-2"
                            />
                          </div>
                        ))}
                        {position.unusedVotes > 0 && (
                          <div className="mt-4">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium text-muted-foreground">Unused Votes</span>
                              <Badge variant="outline">{position.unusedVotes}</Badge>
                            </div>
                            <Progress 
                              value={(position.unusedVotes / electionData.total_votes) * 100} 
                              className="h-2"
                            />
                          </div>
                        )}
                      </ScrollArea>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Winners</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {position.winners.length > 0 ? (
                        <div className="space-y-4">
                          {position.winners.map((winner) => (
                            <Card key={winner.id} className="bg-primary/10">
                              <CardContent className="flex items-center p-4">
                                <Trophy className="mr-4 text-primary" />
                                <div>
                                  <p className="font-bold">{winner.member_name}</p>
                                  <p className="text-sm text-muted-foreground">{winner.votes} votes</p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground flex items-center">
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          No winner for this position.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
        <Button
                variant="outline"
                onClick={()=>{navigate(`/room/${election_id}`)}}
                className=" bg-black text-white dark:bg-white dark:text-black"  
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
      </Tabs>
      
    </div>
  );
};

export default ResultsPage;