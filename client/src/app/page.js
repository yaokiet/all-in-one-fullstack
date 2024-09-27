"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';
import ScheduleView from '@/components/scheduleView';

export default function OwnSchedule() {
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getWeekStart = (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    };

    const [schedule, setSchedule] = useState([]);  
    const [workArrangements, setWorkArrangements] = useState([]);
    const [workModeByDate, setWorkModeByDate] = useState({});
    const [user, setUser] = useState({
        name: "John Doe",
        userid: 210045,
        role: "Software Developer"
    });
    const [activeNav, setActiveNav] = useState('View own schedule');
    const [currentDate, setCurrentDate] = useState(() => getWeekStart(new Date()));
    const [viewMode, setViewMode] = useState('week');
    const [error, setError] = useState(null);

    // WFH application form state
    const [wfhForm, setWfhForm] = useState({
        reason: '',
        date: formatDate(new Date()), // Default to today
        duration: ''
    });

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
            
            const startDay = monthStart.getDay();
            for (let i = (startDay === 0 ? -6 : 1) - startDay; i < 0; i++) {
                const day = new Date(monthStart);
                day.setDate(day.getDate() + i);
                days.push(day);
            }

            for (let d = monthStart; d <= monthEnd; d.setDate(d.getDate() + 1)) {
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
    };

    const updateWorkModeandStatus = (arrangements) => {
        const newWorkModeByDate = {};

        arrangements.forEach((arrangement) => {
            const arrangementDate = formatDate(new Date(arrangement.arrangement_date));
            newWorkModeByDate[arrangementDate] = {
                mode: arrangement.arrangement_type,
                status: arrangement.status
            }
        });

        console.log("Updated Work Mode and Status By Date:", newWorkModeByDate);
        setWorkModeByDate(newWorkModeByDate);
    };

    useEffect(() => {
        console.log("Generating Schedule for Date:", currentDate);
        generateSchedule(currentDate, viewMode);
    }, [currentDate, viewMode]);

    useEffect(() => {
        if (schedule.length > 0) {
            const staff_id = user.userid;
            const start_date = formatDate(schedule[0]);
            const end_date = formatDate(schedule[schedule.length - 1]);

            console.log('Fetching work arrangements for:', start_date, 'to', end_date);

            const fetchOwnArrangements = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/arrangements?staff_id=${staff_id}&start_date=${start_date}&end_date=${end_date}`, {
                        method: 'GET',
                    });

                    if (!response.ok) {
                        throw new Error(`Error: ${response.statusText}`);
                    }

                    const data = await response.json();
                    console.log('Work Arrangements:', data);
                    setWorkArrangements(data);
                    updateWorkModeandStatus(data);
                } catch (err) {
                    console.error('Error fetching work arrangements:', err.message);
                    setError(err.message);
                }
            };

            fetchOwnArrangements();
        } else {
            console.log("Schedule is empty, waiting for it to populate...");
        }
    }, [schedule]);

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

    const handleWfhInputChange = (e) => {
        const { name, value } = e.target;
        setWfhForm(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleWfhSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting WFH Application:', wfhForm);
        
        // Submit the form to your API
        try {
            const response = await fetch('http://localhost:5000/wfh-application', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(wfhForm)
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Application submitted successfully:', result);
            alert('Application submitted successfully!');
            setWfhForm({ reason: '', date: formatDate(new Date()), duration: '' }); // Reset form
        } catch (err) {
            console.error('Error submitting application:', err.message);
            alert('Failed to submit application: ' + err.message);
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
                            workMode={workModeByDate}
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
                            <h2 className="text-xl font-bold mb-4">WFH Application Form</h2>
                            <form onSubmit={handleWfhSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="date">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        id="date"
                                        value={wfhForm.date}
                                        onChange={handleWfhInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="reason">
                                        Reason
                                    </label>
                                    <textarea
                                        name="reason"
                                        id="reason"
                                        rows="3"
                                        value={wfhForm.reason}
                                        onChange={handleWfhInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="duration">
                                        Duration (in days)
                                    </label>
                                    <input
                                        type="number"
                                        name="duration"
                                        id="duration"
                                        value={wfhForm.duration}
                                        onChange={handleWfhInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        required
                                    />
                                </div>
                                <button type="submit" className="mt-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded">
                                    Submit
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

