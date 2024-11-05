"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@nextui-org/react";
import TeamCard from "./teamCard";

export default function ManagerTeamList({
  department,
  setPageState,
  setPosition,
  role,
}) {
  const [teams, setTeams] = useState([]); // State to store team data
  const [isLoading, setIsLoading] = useState(true); // Loading state

  const handleBackClick = () => {
    setPageState("department");
  }
 
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setIsLoading(true); // Set loading to true at the start of the fetch
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/manager_subordinate_groups?department=${department}`,
          { method: "GET", credentials: "include" }
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data.subordinate_groups);
          setTeams(data.subordinate_groups);
        } else {
          console.error("Failed to fetch teams");
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetch completes
      }
    };

    if (department) {
      fetchTeams();
    }
  }, [department]);

  return (
    <div className="bg-gray-100 rounded-lg shadow-md container mx-auto p-5">
      <div className="">
        {/* Conditionally render the Back button if role meets criteria */}
        {role == 1 && (
          <Button
          className="bg-blue-500 w-12 h-10 p-2 pr-2 text-white rounded-full shadow hover:bg-blue-600 my-4 flex items-center justify-center"
          onClick={handleBackClick}
        >
          <ArrowLeft className="h-5 w-5" />
          <h2 className="">Back</h2>
        </Button>
        )}

        <h2 className="text-xl font-bold mb-4">List of {department} Teams</h2>

        {/* Show loading spinner if data is being fetched */}
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {teams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                setPageState={setPageState}
                setPosition={setPosition}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
