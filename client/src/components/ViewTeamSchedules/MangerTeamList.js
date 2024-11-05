"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@nextui-org/react";
import TeamCard from "./teamCard";

export default function ManagerTeamList({ department }) {
  const [teams, setTeams] = useState([]); // State to store team data

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/manager_subordinate_groups?department=${department}`,
          { method: "GET", credentials: "include" }
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data.subordinate_groups);
          setTeams(data.subordinate_groups); // Assuming the data contains a `teams` array
        } else {
          console.error("Failed to fetch teams");
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    // Fetch teams on initial load or when department changes
    if (department) {
      fetchTeams();
    }
  }, [department]);

  return (
    <div className="bg-gray-100 rounded-lg shadow-md container mx-auto p-5">
      <div className="">
        <Button className="bg-blue-500 w-12 h-10 p-2 pr-2 text-white rounded-full shadow hover:bg-blue-600 my-4 flex items-center justify-center">
          <ArrowLeft className="h-5 w-5" />
          <h2 className="ml-2">Back</h2>
        </Button>

        <h2 className="text-xl font-bold mb-4">List of {department} Teams</h2>

        {/* Map over teams array to render a TeamCard for each team */}
        <div className="space-y-4">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} /> // Pass `team` data to each TeamCard
          ))}
        </div>
      </div>
    </div>
  );
}
