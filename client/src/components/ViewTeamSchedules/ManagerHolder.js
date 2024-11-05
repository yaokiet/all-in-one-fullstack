"use client";

import React, { useState, useEffect } from "react";
import ManagerDepartmentList from "./ManagerDepartmentList";
import ManagerTeamList from "./MangerTeamList";
import ManagerTeam from "./ManagerTeam";

export default function ManagerHolder({ currentDate, role }) {
  const [pageState, setPageState] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("Sales");

  // Set initial page state based on role
  useEffect(() => {
    if (role === 1) {
      setPageState("department");
    } else if (role === 3) {
      setPageState("teamList");
    }
  }, [role]);

  return (
    <div>
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
          role={role}
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
