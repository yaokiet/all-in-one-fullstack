import React, { useState, useEffect } from "react";
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek } from "date-fns";
import TeamDayCard from "../teamdaycard";
import TeamOverview from "../teamoverview";

export default function OverallView({ currentDate }) {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(currentDate, { weekStartsOn: 1 }));
  const [currentWeekEnd, setCurrentWeekEnd] = useState(endOfWeek(currentDate, { weekStartsOn: 1 }));
  const [teamArrangementsWithCount, setTeamArrangementsWithCount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTeamData, setSelectedTeamData] = useState([]);
  const [allTeamMembers, setAllTeamMembers] = useState([]);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Fetch team arrangements for the week
  useEffect(() => {
    const fetchTeamArrangements = async () => {
      setIsLoading(true);
      try {
        const start_date = format(currentWeekStart, 'yyyy-MM-dd');
        const end_date = format(currentWeekEnd, 'yyyy-MM-dd');
        const response = await fetch(
          `http://localhost:5000/team_arrangements_with_count?start_date=${start_date}&end_date=${end_date}`,
          { method: 'GET', credentials: 'include' }
        );

        if (!response.ok) throw new Error("Failed to fetch team arrangements");

        const data = await response.json();
        setTeamArrangementsWithCount(data.daily_data);
        setAllTeamMembers(data.team_members);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamArrangements();
  }, [currentWeekStart, currentWeekEnd]);

  const handleDayClick = (date) => {
    const dayData = teamArrangementsWithCount?.[date];
    setSelectedDate(date);
    if (dayData) setSelectedTeamData(dayData.schedules);
    setModalOpen(true);
  };

  const navigateWeek = (direction) => {
    const newWeekStart = direction === "next"
      ? addWeeks(currentWeekStart, 1)
      : subWeeks(currentWeekStart, 1);

    setCurrentWeekStart(newWeekStart);
    setCurrentWeekEnd(endOfWeek(newWeekStart, { weekStartsOn: 1 }));
  };

  const formatDate = (date, idx) => format(new Date(currentWeekStart.getTime() + idx * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">
          Team WFH and Office Status ({format(currentWeekStart, 'dd MMM')} - {format(currentWeekEnd, 'dd MMM')})
        </h2>

        {/* Week Navigation Buttons */}
        <div className="flex justify-between mb-4">
          <button
            onClick={() => navigateWeek("previous")}
            className="bg-gray-300 text-black px-4 py-2 rounded shadow hover:bg-gray-400"
          >
            Previous Week
          </button>
          <button
            onClick={() => navigateWeek("current")}
            className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
          >
            Current Week
          </button>
          <button
            onClick={() => navigateWeek("next")}
            className="bg-gray-300 text-black px-4 py-2 rounded shadow hover:bg-gray-400"
          >
            Next Week
          </button>
        </div>

        {/* Team Schedule Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                {daysOfWeek.map((day) => (
                  <th key={day} className="px-4 py-2 border text-left">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {isLoading ? (
                  <td colSpan={daysOfWeek.length} className="text-center py-4">
                    Loading team schedules...
                  </td>
                ) : (
                  daysOfWeek.map((_, idx) => {
                    const date = formatDate(currentWeekStart, idx);
                    const dayData = teamArrangementsWithCount?.[date];

                    return (
                      <td key={idx} className="px-4 py-2 border">
                        <TeamDayCard
                          dayData={dayData}
                          date={date}
                          onClick={() => handleDayClick(date)}
                        />
                      </td>
                    );
                  })
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for team status */}
      <TeamOverview
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        date={selectedDate}
        teamData={selectedTeamData}
        allTeamMembers={allTeamMembers}
      />
    </div>
  );
}
