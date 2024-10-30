import React, { useState, useEffect } from "react";
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek } from "date-fns";
import TeamDayCard from "../teamdaycard";
import TeamOverview from "./teamoverview";

export default function OverallView({ currentDate }) {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(currentDate, { weekStartsOn: 1 })
  );
  const [currentWeekEnd, setCurrentWeekEnd] = useState(
    endOfWeek(currentDate, { weekStartsOn: 1 })
  );
  const [teamArrangementsWithCount, setTeamArrangementsWithCount] =
    useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTeamData, setSelectedTeamData] = useState([]);
  const [allTeamMembers, setAllTeamMembers] = useState([]);
  const [animationTrigger, setAnimationTrigger] = useState(0);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Fetch team arrangements for the week
  useEffect(() => {
    const fetchTeamArrangements = async () => {
      setIsLoading(true);
      try {
        const start_date = format(currentWeekStart, "yyyy-MM-dd");
        const end_date = format(currentWeekEnd, "yyyy-MM-dd");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/team_arrangements_with_count?start_date=${start_date}&end_date=${end_date}`,
          { method: "GET", credentials: "include" }
        );

        if (!response.ok) throw new Error("Failed to fetch team arrangements");

        const data = await response.json();
        setTeamArrangementsWithCount(data.daily_data);
        setAllTeamMembers(data.team_members);
        setAnimationTrigger((prev) => prev + 1); // Trigger animation
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
    if (direction === "current") {
      const thisWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      setCurrentWeekStart(thisWeekStart);
      setCurrentWeekEnd(endOfWeek(thisWeekStart, { weekStartsOn: 1 }));
    } else {
      const newWeekStart =
        direction === "next"
          ? addWeeks(currentWeekStart, 1)
          : subWeeks(currentWeekStart, 1);

      setCurrentWeekStart(newWeekStart);
      setCurrentWeekEnd(endOfWeek(newWeekStart, { weekStartsOn: 1 }));
    }
  };

  const formatDate = (date, idx) =>
    format(
      new Date(currentWeekStart.getTime() + idx * 24 * 60 * 60 * 1000),
      "yyyy-MM-dd"
    );

  return (
    <div className="bg-gray-100 rounded-lg shadow-md container mx-auto p-5">
      <div className="">
        <h2 className="text-xl font-bold mb-4">
          Team WFH and Office Status ({format(currentWeekStart, "dd MMM")} -{" "}
          {format(currentWeekEnd, "dd MMM")})
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
        <div className=" rounded-xl border overflow-hidden">
          <table className="min-w-full bg-white border table-fixed">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Time</th>
                {daysOfWeek.map((day) => (
                  <th key={day} className="px-4 py-2 border">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* AM */}
              <tr>
                <td className="text-center px-4 py-16  border">AM</td>
                {isLoading ? (
                  <td
                    colSpan={daysOfWeek.length}
                    className="text-center px-4 py-6 border"
                  >
                    Loading team schedules...
                  </td>
                ) : (
                  daysOfWeek.map((_, idx) => {
                    const date = formatDate(currentWeekStart, idx);
                    const dayData = teamArrangementsWithCount?.[date];

                    return (
                      <td key={idx} className="px-4 py-4 border">
                        <div
                          className="opacity-0 transform translate-y-4 transition-all duration-500 ease-out"
                          style={{
                            animationDelay: `${idx * 50}ms`,
                            animationFillMode: "forwards",
                            animation: `fadeInUp 0.3s ease-out ${
                              idx * 50
                            }ms forwards`,
                          }}
                        >
                          <TeamDayCard
                            dayData={dayData}
                            date={date}
                            onClick={() => handleDayClick(date)}
                          />
                        </div>
                      </td>
                    );
                  })
                )}
              </tr>

              {/* PM */}
              <tr>
                <td className="text-center px-4 py-16  border">PM</td>
                {isLoading ? (
                  <td
                    colSpan={daysOfWeek.length}
                    className="text-center px-4 py-6 border"
                  >
                    Loading team schedules...
                  </td>
                ) : (
                  daysOfWeek.map((_, idx) => {
                    const date = formatDate(currentWeekStart, idx);
                    const dayData = teamArrangementsWithCount?.[date];

                    return (
                      <td key={idx} className="px-4 py-4 border">
                        <div
                          className="opacity-0 transform translate-y-4 transition-all duration-500 ease-out"
                          style={{
                            animationDelay: `${idx * 50}ms`,
                            animationFillMode: "forwards",
                            animation: `fadeInUp 0.3s ease-out ${
                              idx * 50
                            }ms forwards`,
                          }}
                        >
                          <TeamDayCard
                            dayData={dayData}
                            date={date}
                            onClick={() => handleDayClick(date)}
                          />
                        </div>
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

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
