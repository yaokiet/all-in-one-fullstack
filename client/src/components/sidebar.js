import React from "react";

const Sidebar = ({ activeNav, setActiveNav }) => (
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
        View own schedule
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
        View Overall Schedule
      </li>
      <li
        className={`cursor-pointer p-4 rounded mt-2 ${
          activeNav === "View Team Members' Schedules"
            ? "bg-blue-500 text-white"
            : "hover:bg-gray-300"
        }`}
        onClick={() => setActiveNav("View Team Members' Schedules")}
      >
        View Team Members' Schedules
      </li>
      <li
        className={`cursor-pointer p-4 rounded mt-2 ${
          activeNav === "View All Schedules"
            ? "bg-blue-500 text-white"
            : "hover:bg-gray-300"
        }`}
        onClick={() => setActiveNav("View All Schedules")}
      >
        View All Schedules
      </li>
    </ul>
  </nav>
);

export default Sidebar;
