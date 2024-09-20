"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export default function OwnSchedule() {
    const [week, setWeek] = useState([]);
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
    const [currentWeekStart, setCurrentWeekStart] = useState(new Date());

    const generateWeek = (startDate) => {
        const days = [];
        for (let i = 0; i < 5; i++) {
            const day = new Date(startDate);
            day.setDate(startDate.getDate() + i);
            days.push(day);
        }
        setWeek(days);
    };

    const getCurrentWeekStart = () => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        return new Date(today.setDate(diff));
    };

    useEffect(() => {
        const startOfWeek = getCurrentWeekStart();
        setCurrentWeekStart(startOfWeek);
        generateWeek(startOfWeek);
    }, []);

    const navigateWeek = (direction) => {
        const newWeekStart = new Date(currentWeekStart);
        newWeekStart.setDate(currentWeekStart.getDate() + (direction === 'next' ? 7 : -7));
        setCurrentWeekStart(newWeekStart);
        generateWeek(newWeekStart);
    };

    const returnToCurrentWeek = () => {
        const startOfWeek = getCurrentWeekStart();
        setCurrentWeekStart(startOfWeek);
        generateWeek(startOfWeek);
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
                                    onClick={() => navigateWeek('prev')}
                                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <div className="flex items-center">
                                    <h2 className="text-xl font-bold mr-4">
                                        {week.length > 0 && formatDateRange(week[0], week[4])}
                                    </h2>
                                    <button
                                        onClick={returnToCurrentWeek}
                                        className="p-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
                                    >
                                        <Calendar className="h-5 w-5 mr-1" />
                                        Today
                                    </button>
                                </div>
                                <button 
                                    onClick={() => navigateWeek('next')}
                                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                {week.map((day, index) => {
                                    const dayName = day.toLocaleDateString('en-US', { weekday: 'long' });
                                    const workModeForDay = workMode[dayName];
                                    return (
                                        <div key={day.toISOString()} className="rounded shadow overflow-hidden">
                                            <div className="bg-gray-100 p-2">
                                                <h3 className="font-bold">{day.toDateString()}</h3>
                                            </div>
                                            <div className={`p-2 ${getWorkModeColor(workModeForDay)}`}>
                                                <p className="font-medium">{workModeForDay}</p>
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