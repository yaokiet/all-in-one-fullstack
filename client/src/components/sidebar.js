import React from "react";

const Sidebar = ({ activeNav, setActiveNav, role }) => (
  <nav className="bg-gray-200 w-64 p-4 flex flex-col">
    <ul className="flex-1 flex flex-col justify-start">
      <li
        className={`cursor-pointer p-4 rounded ${
          activeNav === "View own schedule"
            ? "bg-blue-500 text-white"
            : "hover:bg-gray-300"
        }`}
        onClick={() => setActiveNav("View own schedule")}
      >
        View My Schedule
      </li>
      <li
        className={`cursor-pointer p-4 rounded mt-2 ${
          activeNav === "Apply for WFH"
            ? "bg-blue-500 text-white"
            : "hover:bg-gray-300"
        }`}
        onClick={() => setActiveNav("Apply for WFH")}
      >
        Apply for WFH
      </li>
      <li
        className={`cursor-pointer p-4 rounded mt-2 ${
          activeNav === "View Overall Schedule"
            ? "bg-blue-500 text-white"
            : "hover:bg-gray-300"
        }`}
        onClick={() => setActiveNav("View Overall Schedule")}
      >
        Own Team View
      </li>

      {/* Conditionally render based on role */}
      {(role === 1 || role === 3) && (
        <>
          <li
            className={`cursor-pointer p-4 rounded mt-2 ${
              activeNav === "View Team Members' Schedules"
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-300"
            }`}
            onClick={() => setActiveNav("View Team Members' Schedules")}
          >
            Manage View
          </li>

          <li
            className={`cursor-pointer p-4 rounded mt-2 ${
              activeNav === "Manage WFH Requests"
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-300"
            }`}
            onClick={() => setActiveNav("Manage WFH Requests")}
          >
            Manage WFH Requests
          </li>
          
        </>
      )}
    </ul>
  </nav>
);

export default Sidebar;
