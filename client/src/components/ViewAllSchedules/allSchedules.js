// src/components/ViewAllSchedules/allSchedules.js
import React, { useState, useEffect } from "react";
import { format, startOfWeek, endOfWeek } from "date-fns";
import ApplyWFHModal from "@/components/ApplyWFHModal"; // Adjust the import as necessary
import OverallView from "../ViewOverallSchedule/overallSchedule"; // Ensure the path is correct

export default function AllSchedules({ currentDate }) {
  const [requests, setRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOverallViewOpen, setIsOverallViewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedManager, setSelectedManager] = useState(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(currentDate, { weekStartsOn: 1 })
  );
  const [currentWeekEnd, setCurrentWeekEnd] = useState(
    endOfWeek(currentDate, { weekStartsOn: 1 })
  );
  const [filterType, setFilterType] = useState("department");
  const [selectedFilter, setSelectedFilter] = useState("");

  // Sample team managers for each team
  const teamManagers = {
    "Sales Manager": [
      { name: "Rahim Khalid", am: "AM1", pm: "PM1" },
      { name: "Bob Smith", am: "AM2", pm: "PM2" },
    ],
    "Consultant": [
      { name: "Charlie Brown", am: "AM3", pm: "PM3" },
      { name: "Diana Prince", am: "AM4", pm: "PM4" },
    ],
    "Developers": [
      { name: "Eve Adams", am: "AM5", pm: "PM5" },
      { name: "Frank Castle", am: "AM6", pm: "PM6" },
    ],
    "Senior Engineers": [
      { name: "George Washington", am: "AM7", pm: "PM7" },
      { name: "Hannah Arendt", am: "AM8", pm: "PM8" },
    ],
    "HR Team": [
      { name: "Irene Adler", am: "AM9", pm: "PM9" },
    ],
    "Finance Managers": [
      { name: "Jack Ryan", am: "AM10", pm: "PM10" },
    ],
    "IT Team": [
      { name: "Karen Page", am: "AM11", pm: "PM11" },
    ],
    "Account Managers": [
      { name: "Larry Page", am: "AM12", pm: "PM12" },
    ],
    "Support Team": [
      { name: "Phuc Le", am: "AM13", pm: "PM13" },
    ],
    "Junior Engineers": [
      { name: "Nathan Drake", am: "AM14", pm: "PM14" },
    ],
    "L&D Team": [
      { name: "Olivia Pope", am: "AM15", pm: "PM15" },
    ],
    "Admin Team": [
      { name: "Peter Parker", am: "AM16", pm: "PM16" },
    ],
    "Call Centre": [
      { name: "Quentin Tarantino", am: "AM17", pm: "PM17" },
    ],
    "Operation Planning Team": [
      { name: "Rachel Green", am: "AM18", pm: "PM18" },
    ],
    "Finance Executive": [
      { name: "Steve Rogers", am: "AM19", pm: "PM19" },
    ],
  };

  // Sample departments and their respective managers
  const departments = {
    "HR": [
      { name: "Irene Adler", am: "HR_AM1", pm: "HR_PM1" },
      { name: "Mary Jane", am: "HR_AM2", pm: "HR_PM2" },
    ],
    "Engineering": [
      { name: "Eve Adams", am: "ENG_AM1", pm: "ENG_PM1" },
      { name: "Frank Castle", am: "ENG_AM2", pm: "ENG_PM2" },
    ],
    "Sales": [
      { name: "Rahim Khalid", am: "SALES_AM1", pm: "SALES_PM1" },
      { name: "Bob Smith", am: "SALES_AM2", pm: "SALES_PM2" },
    ],
  };

  // Fetch requests based on activeTab and the current week (you can add your logic here)
  useEffect(() => {
    const fetchRequests = async () => {
      // Your fetch logic here
    };
    fetchRequests();
  }, [activeTab, currentWeekStart, currentWeekEnd]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openOverallView = (manager) => {
    setSelectedManager(manager);
    setIsOverallViewOpen(true);
  };

  const closeOverallView = () => {
    setIsOverallViewOpen(false);
    setSelectedManager(null);
  };

  const handleBackClick = () => {
    closeOverallView();
  };

  // Logic to determine which managers to display
  const selectedManagers = filterType === "team"
    ? selectedFilter && selectedFilter !== "Select Team" 
      ? teamManagers[selectedFilter] || [] 
      : []
    : selectedFilter && selectedFilter !== "Select Department" 
      ? departments[selectedFilter] || [] 
      : [];

  // Handle filter changes and reset OverallView when filter changes
  const handleFilterChange = (type, value) => {
    setFilterType(type);
    setSelectedFilter(value);
    setIsOverallViewOpen(false); // Close OverallView when changing filter
  };

  return (
    <div className="bg-gray-100 rounded-lg shadow-md container mx-auto p-5">
      <h1 className="text-xl font-bold text-center">All Schedules</h1>
      
      <div className="mb-4">
        <label htmlFor="filterType" className="font-semibold">Filter by:</label>
        <select
          id="filterType"
          value={filterType}
          onChange={(e) => handleFilterChange(e.target.value, selectedFilter)}
          className="ml-2 border rounded p-2"
        >
          <option value="department">Department</option>
          <option value="team">Team</option>
        </select>

        {filterType === "department" ? (
          <select
            value={selectedFilter}
            onChange={(e) => handleFilterChange(filterType, e.target.value)}
            className="ml-2 border rounded p-2"
          >
            <option value="Select Department">Select Department</option>
            {Object.keys(departments).map((department, index) => (
              <option key={index} value={department}>{department}</option>
            ))}
          </select>
        ) : (
          <select
            value={selectedFilter}
            onChange={(e) => handleFilterChange(filterType, e.target.value)}
            className="ml-2 border rounded p-2"
          >
            <option value="Select Team">Select Team</option>
            {Object.keys(teamManagers).map((team, index) => (
              <option key={index} value={team}>{team}</option>
            ))}
          </select>
        )}
      </div>

      {selectedManagers.length > 0 && (
        <table className="min-w-full bg-white border table-fixed mb-4">
          <thead>
            <tr>
              <th className="px-4 py-2 border text-center">Manager</th>
              <th className="px-4 py-2 border text-center">AM</th>
              <th className="px-4 py-2 border text-center">PM</th>
            </tr>
          </thead>
          <tbody>
            {selectedManagers.map((manager, index) => (
              <tr key={index} className="cursor-pointer" onClick={() => openOverallView(manager)}>
                <td className="px-4 py-2 border text-center text-blue-500 hover:underline">{manager.name}</td>
                <td className="px-4 py-2 border text-center">{manager.am}</td>
                <td className="px-4 py-2 border text-center">{manager.pm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for applying WFH */}
      {isModalOpen && (
        <ApplyWFHModal onClose={closeModal} selectedManager={selectedManager} />
      )}

      {/* Overall View Modal */}
      {isOverallViewOpen && selectedManager && (
        <OverallView
          currentDate={currentDate}
          selectedManager={selectedManager}
          goBack={handleBackClick} // Pass handleBackClick to OverallView
        />
      )}
    </div>
  );
}
