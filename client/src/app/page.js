"use client";

import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import ScheduleView from "@/components/OwnSchedule/scheduleView";
import WFHApplicationForm from "@/components/ApplyforWFH/applyWFH"; // Import the WFH form
import OverallView from "@/components/ViewOverallSchedule/overallSchedule";
import ManagerHolder from "@/components/ViewTeamSchedules/ManagerHolder";
import ManagerWFHRequests from "@/components/ManageWFH/ManagerWFHRequests";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function OwnSchedule() {
  const formatDate = useCallback((date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  const getWeekStart = useCallback((date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = (day === 0 ? -6 : 1) - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const [schedule, setSchedule] = useState([]);
  const [workArrangements, setWorkArrangements] = useState([]);
  const [workModeByDate, setWorkModeByDate] = useState({});
  const [user, setUser] = useState({
    name: "John Doe",
    userid: 210045,
    role: "Software Developer",
  });
  const [username, setUsername] = useState("");
  const router = useRouter();
  const [role, setRole] = useState("");
  const [position, setPosition] = useState("");
  const [activeNav, setActiveNav] = useState("View own schedule");

  const [currentDate, setCurrentDate] = useState(() =>
    getWeekStart(new Date())
  );
  const [viewMode, setViewMode] = useState("week");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // State for WFH application limits (date range, max weeks)
  const [wfhForm, setWfhForm] = useState({
    date: "",
    duration: 1,
    recurringWeeks: 1,
    reason: "",
  });

  // Handle input changes in the WFH form
  const handleWfhInputChange = (e) => {
    const { name, value } = e.target;
    setWfhForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleWfhSubmit = (e) => {
    e.preventDefault();
    console.log("WFH Form Submitted:", wfhForm);
    // Handle form submission logic here (e.g., sending data to the backend)
  };

  const [minWFHDate, setMinWFHDate] = useState("");
  const [maxWFHDate, setMaxWFHDate] = useState("");
  const [maxRecurringWeeks, setMaxRecurringWeeks] = useState(1);

  useEffect(() => {
    // This effect updates max recurring weeks when the start date changes
    if (wfhForm.date) {
      setMaxRecurringWeeks(wfhForm.date);
    }
  }, [wfhForm.date, setMaxRecurringWeeks]);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/auth`,
          {},
          {
            withCredentials: true,
          }
        );
        if (response.data.code === 200) {
          console.log(response.data);
          setUsername(
            response.data.staff_fname + " " + response.data.staff_lname
          );
          setPosition(response.data.position);
          setRole(response.data.role);
          setIsLoading(false);
        } else {
          console.log("error with auth", response.data);
          router.push("/authentication");
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        router.push("/authentication");
      }
    };

    checkAuth();
  }, [router]);

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

        const startDay = monthStart.getDay();
        for (let i = (startDay === 0 ? -6 : 1) - startDay; i < 0; i++) {
          const day = new Date(monthStart);
          day.setDate(day.getDate() + i);
          days.push(day);
        }

        for (
          let d = new Date(monthStart);
          d <= monthEnd;
          d.setDate(d.getDate() + 1)
        ) {
          days.push(new Date(d));
        }

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

  const updateWorkModeandStatus = useCallback(
    (arrangements) => {
      const newWorkModeByDate = {};

      arrangements.forEach((arrangement) => {
        const arrangementDate = formatDate(
          new Date(arrangement.arrangement_date)
        );
        newWorkModeByDate[arrangementDate] = {
          mode: arrangement.arrangement_type,
          status: arrangement.status,
        };
      });

      console.log("Updated Work Mode and Status By Date:", newWorkModeByDate);
      setWorkModeByDate(newWorkModeByDate);
    },
    [formatDate]
  );

  const updateMaxRecurringWeeks = useCallback(
    (selectedDate) => {
      const start = new Date(selectedDate);
      const end = new Date(maxWFHDate);
      let maxWeeks = Math.floor((end - start) / (7 * 24 * 60 * 60 * 1000)) + 1;

      // Ensure the end date of the recurring period doesn't exceed maxWFHDate
      const recurringEndDate = new Date(start);
      recurringEndDate.setDate(recurringEndDate.getDate() + (maxWeeks - 1) * 7);

      if (recurringEndDate > end) {
        maxWeeks = maxWeeks - 1;
      }

      setMaxRecurringWeeks(Math.max(1, maxWeeks));
    },
    [maxWFHDate]
  );

  useEffect(() => {
    if (activeNav !== "View own schedule") return;
    if (activeNav === "View own schedule") {
      generateSchedule(currentDate, viewMode);
    }
  }, [currentDate, viewMode, generateSchedule, activeNav]);

  useEffect(() => {
    if (activeNav !== "View own schedule" || schedule.length === 0) return;
    if (activeNav === "View own schedule" && schedule.length > 0) {
      const fetchOwnArrangements = async () => {
        setIsLoading(true); // Only set loading state when needed
        setError(null); // Reset error state on fetch start

        try {
          const start_date = formatDate(schedule[0]);
          const end_date = formatDate(schedule[schedule.length - 1]);

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/arrangements?start_date=${start_date}&end_date=${end_date}`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setWorkArrangements(data); // Update only if data is fetched
          updateWorkModeandStatus(data); // Update work mode status based on data
        } catch (err) {
          console.error("Error fetching work arrangements:", err.message);
          setError(`Failed to fetch work arrangements: ${err.message}`);

          // Fallback to default state in case of fetch failure
          const defaultWorkMode = {};
          schedule.forEach((date) => {
            const formattedDate = formatDate(date);
            defaultWorkMode[formattedDate] = {
              mode: "Office",
              status: "Default",
            };
          });
          setWorkModeByDate(defaultWorkMode);
        } finally {
          setIsLoading(false); // Stop loading once fetch is done
        }
      };

      fetchOwnArrangements();
    } else {
    }
  }, [schedule, user.userid, formatDate, updateWorkModeandStatus, activeNav]);

  useEffect(() => {
    const today = new Date();
    const twoMonthsAgo = new Date(
      today.getFullYear(),
      today.getMonth() - 2,
      today.getDate()
    );
    const threeMonthsAhead = new Date(
      today.getFullYear(),
      today.getMonth() + 3,
      today.getDate()
    );

    setMinWFHDate(formatDate(twoMonthsAgo));
    setMaxWFHDate(formatDate(threeMonthsAhead));

    // Update max recurring weeks when component mounts
    updateMaxRecurringWeeks(formatDate(today));
  }, [formatDate, updateMaxRecurringWeeks]);

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
    <>
      {!isLoading && (
        <div className="flex flex-col h-screen">
          <Navbar username={username} position={position} role={role} setActiveNav={setActiveNav} // Pass setActiveNav to Navbar
          />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar
              activeNav={activeNav}
              setActiveNav={setActiveNav}
              role={role}
            />
            <div className="flex-1 p-4 overflow-auto">
              {isLoading && (
                <div className="bg-blue-100 text-blue-800 p-4 rounded-md mb-4">
                  <p>Loading work arrangements...</p>
                </div>
              )}

              {activeNav === "View own schedule" && (
                <ScheduleView
                  schedule={schedule}
                  workMode={workModeByDate}
                  currentDate={currentDate}
                  viewMode={viewMode}
                  navigate={navigate}
                  returnToCurrent={returnToCurrent}
                  setViewMode={setViewMode}
                  setCurrentDate={setCurrentDate}
                  error={error}
                />
              )}

              {activeNav === "Apply for WFH" && (
                <WFHApplicationForm
                  wfhForm={wfhForm}
                  minWFHDate={minWFHDate}
                  maxWFHDate={maxWFHDate}
                  maxRecurringWeeks={maxRecurringWeeks}
                  handleWfhInputChange={handleWfhInputChange}
                  handleWfhSubmit={handleWfhSubmit}
                />
              )}

              {activeNav === "View Overall Schedule" && (
                <OverallView
                  currentDate={currentDate}
                  viewMode={viewMode}
                  navigate={navigate}
                  returnToCurrent={returnToCurrent}
                  setViewMode={setViewMode}
                />
              )}

              {activeNav === "Manage WFH Requests" && (
                <ManagerWFHRequests teamSize={10} />
              )}

              {activeNav === "Manage Arrangements" && <ManageArrangement />}

              {activeNav === "View Team Members' Schedules" && (
                <ManagerHolder currentDate={currentDate} role={role} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
