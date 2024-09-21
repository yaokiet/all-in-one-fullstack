"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export default function OwnSchedule() {
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
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState('week');

    const generateSchedule = (date, mode) => {
        const days = [];
        let startDate = new Date(date);

        if (mode === 'week') {
            const dayOfWeek = startDate.getDay();
            startDate.setDate(startDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
            for (let i = 0; i < 5; i++) {
                const day = new Date(startDate);
                day.setDate(startDate.getDate() + i);
                days.push(day);
            }
        } else if (mode === 'month') {
            startDate.setDate(1);
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
        generateSchedule(currentDate, viewMode);
    }, [currentDate, viewMode]);

    const navigate = (direction) => {
        const newDate = new Date(currentDate);
        if (viewMode === 'week') {
            newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        } else {
            newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        }
        setCurrentDate(newDate);
    };

    const returnToCurrent = () => {
        setCurrentDate(new Date());
    };

    const getWorkModeColor = (mode) => {
        return mode === "Office" ? "bg-blue-200" : "bg-green-200";
    };

    const formatDateRange = (start, end) => {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const startStr = start.toLocaleDateString('en-US', options);
        const endStr = end.toLocaleDateString('en-US', options);
        return `${startStr} - ${endStr}`;
    };

    const isToday = (date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    };

    return (
        <div className="flex flex-col h-screen">
            <nav className="bg-blue-500 p-4 text-white">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold">Own Schedule</h1>
                    <div className="text-right">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm">{user.role}</p>
                    </div>
                </div>
            </nav>

            <div className="flex flex-1 overflow-hidden">
                <nav className="bg-gray-200 w-64 p-4 flex flex-col">
                    <ul className="flex-1 flex flex-col justify-start">
                        <li 
                            className={`cursor-pointer p-4 rounded ${activeNav === 'View own schedule' ? 'bg-blue-500 text-white' : 'hover:bg-gray-300'}`}
                            onClick={() => setActiveNav('View own schedule')}
                        >
                            View own schedule
                        </li>
                        <li 
                            className={`cursor-pointer p-4 rounded mt-2 ${activeNav === 'Apply for WFH' ? 'bg-blue-500 text-white' : 'hover:bg-gray-300'}`}
                            onClick={() => setActiveNav('Apply for WFH')}
                        >
                            Apply for WFH
                        </li>
                    </ul>
                </nav>

                <div className="flex-1 p-4 overflow-auto">
                    {activeNav === 'View own schedule' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <button 
                                    onClick={() => navigate('prev')}
                                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <div className="flex items-center space-x-4">
                                    <h2 className="text-xl font-bold">
                                        {viewMode === 'week' 
                                            ? (schedule.length > 0 && formatDateRange(schedule[0], schedule[4]))
                                            : currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
                                        }
                                    </h2>
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
                            <div className={`grid gap-4 ${viewMode === 'week' ? 'grid-cols-5' : 'grid-cols-7'}`}>
                                {schedule.map((day, index) => {
                                    const dayName = day.toLocaleDateString('en-US', { weekday: 'long' });
                                    const workModeForDay = workMode[dayName] || "N/A";
                                    const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                                    const isTodayHighlight = isToday(day);
                                    return (
                                        <div 
                                            key={day.toISOString()} 
                                            className={`rounded shadow overflow-hidden ${isCurrentMonth ? '' : 'opacity-50'} ${isTodayHighlight ? 'border-2 border-blue-500' : ''}`}
                                        >
                                            <div className="bg-gray-100 p-2">
                                                <h3 className={`font-bold ${isTodayHighlight ? 'text-blue-600' : ''}`}>
                                                    {day.getDate()}
                                                </h3>
                                                <p className="text-xs">
                                                    {dayName}
                                                </p>
                                            </div>
                                            <div className={`p-2 ${getWorkModeColor(workModeForDay)}`}>
                                                <p className="font-medium text-sm">{workModeForDay}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
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