"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';

const DayCard = ({ day, workMode, isCurrentMonth, isToday, isWeekend }) => (
    <div 
        className={`rounded shadow overflow-hidden ${isCurrentMonth ? '' : 'opacity-50'} ${isToday ? 'border-2 border-blue-500' : ''} ${isWeekend ? 'opacity-50' : ''}`}
    >
        <div className="bg-gray-100 p-2">
            <h3 className={`font-bold ${isToday ? 'text-blue-600' : ''}`}>
                {day.getDate()}
            </h3>
            <p className="text-xs">
                {day.toLocaleDateString('en-US', { weekday: 'long' })}
            </p>
        </div>
        <div className={`p-2 ${isWeekend ? 'bg-gray-200' : (workMode === "Office" ? "bg-blue-200" : "bg-green-200")}`}>
            <p className="font-medium text-sm">{isWeekend ? 'Weekend' : workMode}</p>
        </div>
    </div>
);

const ScheduleView = ({ schedule, workMode, currentDate, viewMode, navigate, returnToCurrent, setViewMode, setCurrentDate }) => {
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

    const getWeekStart = (date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    };

    const formatDateRange = (start, end) => {
        const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        return `${startStr} - ${endStr}`;
    };

    const generateWeekOptions = () => {
        const options = [];
        const currentYear = currentDate.getFullYear();
        const startDate = new Date(currentYear - 1, 0, 1);
        const endDate = new Date(currentYear + 1, 11, 31);

        for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 7)) {
            const weekStart = getWeekStart(d);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            
            options.push({
                value: weekStart.toISOString(),
                label: formatDateRange(weekStart, weekEnd)
            });
        }
        return options;
    };

    const generateMonthOptions = () => {
        const options = [];
        const currentYear = currentDate.getFullYear();
        for (let year = currentYear - 1; year <= currentYear + 1; year++) {
            for (let month = 0; month < 12; month++) {
                const date = new Date(year, month, 1);
                options.push({
                    value: date.toISOString(),
                    label: date.toLocaleString('default', { month: 'long', year: 'numeric' })
                });
            }
        }
        return options;
    };

    const handleDateChange = (e) => {
        const newDate = new Date(e.target.value);
        setCurrentDate(newDate);
    };

    const getDropdownValue = () => {
        if (viewMode === 'week') {
            return getWeekStart(currentDate).toISOString();
        } else {
            return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <button 
                    onClick={() => navigate('prev')}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex items-center space-x-4">
                    <select
                        value={getDropdownValue()}
                        onChange={handleDateChange}
                        className="p-2 border rounded"
                    >
                        {viewMode === 'week' 
                            ? generateWeekOptions().map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                              ))
                            : generateMonthOptions().map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                              ))
                        }
                    </select>
                    <button
                        onClick={returnToCurrent}
                        className="p-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
                    >
                        <Calendar className="h-5 w-5 mr-1" />
                        Today
                    </button>
                    <select
                        value={viewMode}
                        onChange={(e) => setViewMode(e.target.value)}
                        className="p-2 border rounded"
                    >
                        <option value="week">Week</option>
                        <option value="month">Month</option>
                    </select>
                </div>
                <button 
                    onClick={() => navigate('next')}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>
            <div className="grid grid-cols-7 gap-4">
                {schedule.map((day) => (
                    <DayCard
                        key={day.toISOString()}
                        day={day}
                        workMode={workMode[day.toLocaleDateString('en-US', { weekday: 'long' })] || "N/A"}
                        isCurrentMonth={day.getMonth() === currentDate.getMonth()}
                        isToday={isToday(day)}
                        isWeekend={isWeekend(day)}
                    />
                ))}
            </div>
        </div>
    );
};

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
        Friday: "Office"
    });

    const [user, setUser] = useState({
        name: "John Doe",
        role: "Software Developer"
    });

    const [activeNav, setActiveNav] = useState('View own schedule');
    const [currentDate, setCurrentDate] = useState(() => getWeekStart(new Date()));
    const [viewMode, setViewMode] = useState('week');

    const generateSchedule = (date, mode) => {
        const days = [];
        let startDate = new Date(date);

        if (mode === 'week') {
            startDate = getWeekStart(startDate);
            for (let i = 0; i < 7; i++) {
                const day = new Date(startDate);
                day.setDate(startDate.getDate() + i);
                days.push(day);
            }
        } else if (mode === 'month') {
            startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
            const monthStart = new Date(startDate);
            const monthEnd = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
            
            // Add days from previous month to start on Monday
            const startDay = monthStart.getDay();
            for (let i = (startDay === 0 ? -6 : 1) - startDay; i < 0; i++) {
                const day = new Date(monthStart);
                day.setDate(day.getDate() + i);
                days.push(day);
            }

            // Add all days of the current month
            for (let d = monthStart; d <= monthEnd; d.setDate(d.getDate() + 1)) {
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
    };

    useEffect(() => {
        console.log("Current Date:", currentDate);
        generateSchedule(currentDate, viewMode);
    }, [currentDate, viewMode]);

    const navigate = (direction) => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            if (viewMode === 'week') {
                newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
            } else {
                newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
            }
            return newDate;
        });
    };

    const returnToCurrent = () => {
        const today = new Date();
        if (viewMode === 'week') {
            setCurrentDate(getWeekStart(today));
        } else {
            setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <Navbar user={user} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
                <div className="flex-1 p-4 overflow-auto">
                    {activeNav === 'View own schedule' && (
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
                    {activeNav === 'Apply for WFH' && (
                        <div className="bg-white p-4 rounded shadow">
                            <h2 className="text-xl font-bold mb-4">Apply for Work From Home</h2>
                            <p>This feature is not implemented yet. Please check back later.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}