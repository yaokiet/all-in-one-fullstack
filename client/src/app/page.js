"use client";

import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import ScheduleView from "@/components/scheduleView";
import DayCard from "@/components/daycard";

export default function OwnSchedule() {
  const getWeekStart = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const [schedule, setSchedule] = useState([]);
  const [workMode, setWorkMode] = useState({
    Monday: "Office",
    Tuesday: "Work from Home",
    Wednesday: "Office",
    Thursday: "Work from Home",
    Friday: "Office",
  });

  const [user, setUser] = useState({
    name: "Sam Doe",
    role: "Software Developer",
  });

  const [activeNav, setActiveNav] = useState("View own schedule");
  const [currentDate, setCurrentDate] = useState(() =>
    getWeekStart(new Date())
  );
  const [viewMode, setViewMode] = useState("week");

  const generateSchedule = useCallback(
    (date, mode) => {
      const days = [];
      let startDate = new Date(date);

      if (mode === "week") {
        startDate = getWeekStart(startDate);
        for (let i = 0; i < 7; i++) {
          const day = new Date(startDate);
          day.setDate(startDate.getDate() + i);
          days.push(day);
        }
      } else if (mode === "month") {
        startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        const monthStart = new Date(startDate);
        const monthEnd = new Date(
          startDate.getFullYear(),
          startDate.getMonth() + 1,
          0
        );

        // Add days from previous month to start on Monday
        const startDay = monthStart.getDay();
        for (let i = (startDay === 0 ? -6 : 1) - startDay; i < 0; i++) {
          const day = new Date(monthStart);
          day.setDate(day.getDate() + i);
          days.push(day);
        }

        // Add all days of the current month
        for (
          let d = new Date(monthStart);
          d <= monthEnd;
          d.setDate(d.getDate() + 1)
        ) {
          days.push(new Date(d));
        }

        // Add days from next month to end on Sunday
        const endDay = monthEnd.getDay();
        for (let i = 1; i < (endDay === 6 ? 1 : 7 - endDay); i++) {
          const day = new Date(monthEnd);
          day.setDate(day.getDate() + i);
          days.push(day);
        }
      }

      setSchedule(days);
    },
    [getWeekStart]
  );

  useEffect(() => {
    console.log("Current Date:", currentDate);
    generateSchedule(currentDate, viewMode);
  }, []);

  const navigate = useCallback(
    (direction) => {
      setCurrentDate((prevDate) => {
        const newDate = new Date(prevDate);
        if (viewMode === "week") {
          newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
        } else {
          newDate.setMonth(
            newDate.getMonth() + (direction === "next" ? 1 : -1)
          );
        }
        return newDate;
      });
    },
    [viewMode]
  );

  const returnToCurrent = useCallback(() => {
    const today = new Date();
    if (viewMode === "week") {
      setCurrentDate(getWeekStart(today));
    } else {
      setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    }
  }, [viewMode, getWeekStart]);

  return (
    <div className="flex flex-col h-screen">
      <Navbar user={user} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
        <div className="flex-1 p-4 overflow-auto">
          {activeNav === "View own schedule" && (
            <ScheduleView
              schedule={schedule}
              workMode={workMode}
              currentDate={currentDate}
              viewMode={viewMode}
              navigate={navigate}
              returnToCurrent={returnToCurrent}
              setViewMode={setViewMode}
              setCurrentDate={setCurrentDate}
            />
          )}
          {activeNav === "Apply for WFH" && (
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-bold mb-4">
                Apply for Work From Home
              </h2>
              <p>
                This feature is not implemented yet. Please check back later.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
