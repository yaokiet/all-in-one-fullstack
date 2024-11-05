"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@nextui-org/react";
import DepartmentCard from "./departmentCard";

export default function ManagerDepartmentList({ setPageState, setDepartment }) {
  const [depts, setDept] = useState([]); // State to store department data
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchDept = async () => {
      try {
        setIsLoading(true); // Set loading to true at the beginning
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/manager_all_departments`,
          { method: "GET", credentials: "include" }
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data.department_groups);
          setDept(data.department_groups);
        } else {
          console.error("Failed to fetch departments");
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setIsLoading(false); // Set loading to false after the fetch
      }
    };

    fetchDept();
  }, []);

  return (
    <div className="bg-gray-100 rounded-lg shadow-md container mx-auto p-5">
      <h2 className="text-xl font-bold mb-4">List of Departments</h2>

      {/* Display loading spinner while data is being fetched */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {depts.map((dept) => (
            <DepartmentCard
              key={dept.department}
              dept={dept}
              setPageState={setPageState}
              setDepartment={setDepartment}
            />
          ))}
        </div>
      )}
    </div>
  );
}
