import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, User } from "lucide-react";

export default function DepartmentCard({ dept, setPageState, setDepartment }) {
  const handleDeptClick = () => {
    setPageState("teamList");
    setDepartment(dept.department);
  };

  return (
    <div
      onClick={handleDeptClick} // Make the whole card clickable
      className="bg-white border-2 border-black shadow-md rounded-lg overflow-hidden w-full mb-4 cursor-pointer" // Add cursor-pointer for feedback
    >
      <div className="h-full flex flex-row text-center">
        <div className="w-1/4 border-r-2 border-black p-6 bg-blue-600 text-white justify-center flex flex-col items-center">
          <h2 className="text-lg font-semibold ">{dept.department} </h2>
        </div>
        <div className="w-full">
          <div className="p-6 border-b-2 border-black h-1/2 flex flex-row">
            <div className="w-1/2 font-semibold">AM In-Office</div>
            <div className="w-1/2 font-semibold">PM In-Office</div>
          </div>
          <div className="p-6 h-1/2 flex flex-row">
            <div className="w-1/2">
              {dept.AM_in_office} / {dept.total_count}
            </div>
            <div className="w-1/2">
              {dept.PM_in_office} / {dept.total_count}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
