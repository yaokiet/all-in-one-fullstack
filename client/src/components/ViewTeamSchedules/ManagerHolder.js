"use client";

import React, { useState, useEffect } from "react";
import ManagerDepartmentList from "./ManagerDepartmentList";
import ManagerTeamList from "./MangerTeamList";
import ManagerTeam from "./ManagerTeam";

export default function ManagerHolder({ currentDate, role }) {
  const [pageState, setPageState] = useState("");
  const [position, setPosition] = useState("Account Manager");
  const [department, setDepartment] = useState("Sales");

  // Set initial page state based on role
  useEffect(() => {
    if (role === 1) {
      setPageState("team");
    } else if (role === 3) {
      setPageState("manager");
    }
  }, [role]);

  const handleBackClick = () => {
    setPageState("");
  };

  return (
    <div className="rounded-lg shadow-md container mx-auto p-5">
      {/* Conditionally render components based on pageState */}

      {pageState === "team" && (
        <ManagerTeam
          currentDate={currentDate}
          position={position}
          setPageState={setPageState}
        />
      )}

      {pageState === "teamList" && (
        <ManagerTeamList
          currentDate={currentDate}
          setPosition={setPosition}
          setPageState={setPageState}
          department={department}
        />
      )}

      {pageState === "department" && (
        <ManagerDepartmentList
          setPageState={setPageState}
          setDepartment={setDepartment}
        />
      )}
    </div>
  );
}
