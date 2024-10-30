import React, { useState, useEffect } from 'react';
import DayCard from "../daycard";
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const ScheduleView = ({ schedule, workMode, currentDate, viewMode, navigate, returnToCurrent, setViewMode, setCurrentDate }) => {
    const getWeekStart = (date) => {
        const d = new Date(date);  // Create a new date instance
        const day = d.getDay();    // Get the current day of the week (0 for Sunday, 6 for Saturday)
        
        // Calculate the difference to move back to Monday (if Sunday, move back 6 days; otherwise, day - 1)
        const diff = day === 0 ? 6 : day - 1;  
        d.setDate(d.getDate() - diff);  // Adjust the date to move back to Monday
        
        d.setHours(0, 0, 0, 0);  // Reset the time to midnight to avoid time zone issues
        return d;
    };
    // useEffect(() => {
    //     const weekStart = getWeekStart(currentDate);
    //     console.log("Week starts on:", weekStart);
    // }, [currentDate]);

    const [selectedDate, setSelectedDate] = useState(() => getWeekStart(currentDate));
    const [dateOptions, setDateOptions] = useState([]);

    const isToday = (date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    };

    const isWeekend = (date) => {
        const day = date.getDay();
        return day === 0 || day === 6;
    };

    const formatDate = (date) => {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const formatMonth = (date) => {
        const options = { month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const generateDateOptions = () => {
        const options = [];
        const startDate = new Date(currentDate);
        startDate.setMonth(startDate.getMonth() - 2);
        
        for (let i = 0; i < 6; i++) {
            if (viewMode === 'week') {
                for (let j = 0; j < 4; j++) {  // Generate 4 weeks per month
                    const weekStart = getWeekStart(new Date(startDate));
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekEnd.getDate() + 6);
                    options.push({
                        value: weekStart.toISOString(),
                        label: `${formatDate(weekStart)} - ${formatDate(weekEnd)}`
                    });
                    startDate.setDate(startDate.getDate() + 7);
                }
            } else {
                options.push({
                    value: startDate.toISOString(),
                    label: formatMonth(startDate)
                });
                startDate.setMonth(startDate.getMonth() + 1);
            }
        }
        setDateOptions(options);
    };

    useEffect(() => {
        generateDateOptions();
    }, [currentDate, viewMode]);

    const handleDateChange = (value) => {
        const selectedDate = new Date(value);
        setSelectedDate(selectedDate);
        setCurrentDate(selectedDate);
    };
    const formatDateOnly = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;  // Returns YYYY-MM-DD in local time
    };
    

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <button onClick={() => navigate('prev')} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex items-center space-x-4">
                    <select
                        value={viewMode}
                        onChange={(e) => setViewMode(e.target.value)}
                        className="p-2 border rounded"
                    >
                        <option value="week">Week</option>
                        <option value="month">Month</option>
                    </select>
                    <select
                        value={selectedDate.toISOString()}
                        onChange={(e) => handleDateChange(e.target.value)}
                        className="p-2 border rounded"
                    >
                        {dateOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={returnToCurrent}
                        className="p-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
                    >
                        <Calendar className="h-5 w-5 mr-1" />
                        Today
                    </button>
                </div>
                <button onClick={() => navigate('next')} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>
            <div className="grid grid-cols-7 gap-4">
                {schedule.map((day) => {
                    const formattedDate = formatDateOnly(day);
                    const dayData = workMode[formattedDate] || { mode: "Office", status: "N/A" };
                    return (
                        <DayCard
                            key={day.toISOString()}
                            day={day}
                            workMode={dayData.mode}
                            status={dayData.status}
                            isCurrentMonth={day.getMonth() === currentDate.getMonth()}
                            isToday={isToday(day)}
                            isWeekend={isWeekend(day)}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default ScheduleView;