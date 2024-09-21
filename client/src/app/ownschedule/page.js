'use client';
import React, {useState, useEffect} from 'react'


export default function OwnSchedule() {
    const [error, setError] = useState(null);

    useEffect(() => {
        // The following code will return a json of work arrangements for a staff_id, currently hardcoded to 210045 which is a test case, and between a date range, currently hard
        // coded to the entirety of 2024
        // Replace with dynamic values or props
        const staff_id = 210045; // Replace this with actual staff_id
        const start_date = '2024-01-01'; // Replace with dynamic dates
        const end_date = '2024-12-31';   // Replace with dynamic dates

        const fetchOwnArrangements = async () => {
            try {
                const response = await fetch(`http://localhost:5000/arrangements?staff_id=${staff_id}&start_date=${start_date}&end_date=${end_date}`, {
                    method: 'GET',
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const data = await response.json();
                // Log the data to the console
                console.log('Work Arrangements:', data);
            } catch (err) {
                console.error('Error fetching work arrangements:', err.message);
                setError(err.message);
            }
        };

        fetchOwnArrangements();
    }, []); // Empty array ensures this runs once on mount


    return (
        <div>
            <h1>Own Schedule</h1>
            {/* ... */}
        </div>
    )
}