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

const ScheduleView = ({ schedule, workMode, currentDate, viewMode, navigate, returnToCurrent, setViewMode }) => {
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

    const isWeekend = (date) => {
        const day = date.getDay();
        return day === 0 || day === 6;
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
                    <h2 className="text-xl font-bold">
                        {viewMode === 'week' 
                            ? (schedule.length > 0 && formatDateRange(schedule[0], schedule[6]))
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
            for (let i = 0; i < 7; i++) {
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