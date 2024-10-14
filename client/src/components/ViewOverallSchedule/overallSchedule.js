import React, { useState, useEffect } from "react";
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek } from "date-fns";

export default function OverallView({
  teamSchedules,
  currentDate,
  viewMode,
  returnToCurrent,
  setViewMode,
}) {
  const [selectedTeamMember, setSelectedTeamMember] = useState("");
  const [filteredSchedule, seatFilteredSchedule] = useState([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(currentDate, { weekStartsOn: 1 })); // Monday as start of the week
  const [currentWeekEnd, setCurrentWeekEnd] = useState(endOfWeek(currentDate, { weekStartsOn: 1 }));

  // Handle team member selection from dropdown
  const handleMemberSelect = (e) => {
    setSelectedTeamMember(e.target.value);
  };

  const teamMembers = [
    ...new Set(teamSchedules.map((schedule) => schedule.memberName)),
  ];

  // Badge styling for WFH and In Office
  const badgeStyle = {
    wfh: "bg-blue-100 text-blue-700 px-2 py-1 rounded-full",
    office: "bg-green-100 text-green-700 px-2 py-1 rounded-full",
  };

  // Days of the week (Monday to Friday)
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Filter team schedule based on the selected team member and the current week range
  useEffect(() => {
    const filtered = selectedTeamMember
      ? teamSchedules.filter((schedule) => schedule.memberName === selectedTeamMember)
      : teamSchedules;

    // Filter by current week range (simulated here for demo)
    const weekFilteredSchedule = filtered.filter((schedule) => {
      // Logic to determine if the schedule falls within the currentWeekStart to currentWeekEnd
      // For this example, we assume the `schedule.range` contains week info and adjust accordingly
      return true; // Placeholder, adjust based on your date format
    });

    setFilteredSchedule(weekFilteredSchedule);
  }, [selectedTeamMember, teamSchedules, currentWeekStart, currentWeekEnd]);

  // Navigate between weeks
  const handlePreviousWeek = () => {
    const previousWeekStart = subWeeks(currentWeekStart, 1);
    setCurrentWeekStart(previousWeekStart);
    setCurrentWeekEnd(endOfWeek(previousWeekStart, { weekStartsOn: 1 }));
  };

  const handleNextWeek = () => {
    const nextWeekStart = addWeeks(currentWeekStart, 1);
    setCurrentWeekStart(nextWeekStart);
    setCurrentWeekEnd(endOfWeek(nextWeekStart, { weekStartsOn: 1 }));
  };

  const handleCurrentWeek = () => {
    const thisWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    setCurrentWeekStart(thisWeekStart);
    setCurrentWeekEnd(endOfWeek(thisWeekStart, { weekStartsOn: 1 }));
  };

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">
          Team WFH and Office Status ({format(currentWeekStart, 'dd MMM')} - {format(currentWeekEnd, 'dd MMM')})
        </h2>

        {/* Filter Section */}
        <div className="flex justify-between items-center mb-4">
          <select
            value={selectedTeamMember}
            onChange={handleMemberSelect}
            className="border rounded p-2 bg-white shadow-md"
          >
            <option value="">All Team Members</option>
            {teamMembers.map((member, idx) => (
              <option key={idx} value={member}>
                {member}
              </option>
            ))}
          </select>
        </div>

        {/* Week Navigation */}
        <div className="flex justify-between mb-4">
          <button
            onClick={handlePreviousWeek}
            className="bg-gray-300 text-black px-4 py-2 rounded shadow hover:bg-gray-400"
          >
            Previous Week
          </button>
          <button
            onClick={handleCurrentWeek}
            className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
          >
            Current Week
          </button>
          <button
            onClick={handleNextWeek}
            className="bg-gray-300 text-black px-4 py-2 rounded shadow hover:bg-gray-400"
          >
            Next Week
          </button>
        </div>

        {/* Table Structure for Days */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="px-4 py-2 border text-left">Team Member</th>
                {daysOfWeek.map((day, idx) => (
                  <th key={idx} className="px-4 py-2 border text-left">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredSchedule.length > 0 ? (
                filteredSchedule.map((schedule, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="px-4 py-2 border">{schedule.memberName}</td>
                    {daysOfWeek.map((day, dayIdx) => (
                      <td key={dayIdx} className="px-4 py-2 border">
                        <span
                          className={
                            schedule[day]?.status === "WFH"
                              ? badgeStyle.wfh
                              : badgeStyle.office
                          }
                        >
                          {schedule[day]?.status === "WFH"
                            ? "WFH"
                            : "In Office"}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-2 text-center">
                    No schedules found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


