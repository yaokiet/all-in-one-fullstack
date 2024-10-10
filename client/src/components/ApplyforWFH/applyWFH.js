import React, { useState, useEffect } from 'react';
import { Calendar } from "@/components/calendar"

// Simple Button component
const Button = ({ children, ...props }) => (
  <button 
    {...props} 
    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
  >
    {children}
  </button>
);

export default function ApplyWFH() {
  const [selectedDates, setSelectedDates] = useState([]);
  const [arrangement, setArrangement] = useState('Work from Home');
  const [session, setSession] = useState('Full Day');
  const [recurring, setRecurring] = useState('None');
  const [recurrenceCount, setRecurrenceCount] = useState(1);
  const [reason, setReason] = useState('');

  const arrangements = ['Work from Home', 'Office'];
  const recurringOptions = ['None', 'Weekly', 'Bi-weekly', 'Monthly'];
  const sessionOptions = ['AM', 'PM', 'Full Day'];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting:', { selectedDates, arrangement, session, recurring, recurrenceCount, reason });
    // Add your submission logic here
  };

  const isDateDisabled = (date) => {
    const now = new Date();
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());
    const threeMonthsAhead = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());
    return date < twoMonthsAgo || date > threeMonthsAhead;
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Select Dates</label>
          <Calendar
            mode="multiple"
            selected={selectedDates}
            onSelect={setSelectedDates}
            disabled={isDateDisabled}
            className="rounded-md border"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Arrangement</label>
          <select
            value={arrangement}
            onChange={(e) => setArrangement(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            {arrangements.map((arr) => (
              <option key={arr} value={arr}>{arr}</option>
            ))}
          </select>
        </div>

        {arrangement === 'Work from Home' && (
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Session</label>
            <select
              value={session}
              onChange={(e) => setSession(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              {sessionOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Recurring</label>
          <select
            value={recurring}
            onChange={(e) => setRecurring(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            {recurringOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {recurring !== 'None' && (
          <div>
            <label htmlFor="recurrenceCount" className="block mb-2 text-sm font-medium text-gray-700">Number of Recurrences</label>
            <input
              type="number"
              id="recurrenceCount"
              value={recurrenceCount}
              onChange={(e) => setRecurrenceCount(parseInt(e.target.value) || 1)}
              min={1}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
        )}

        <div>
          <label htmlFor="reason" className="block mb-2 text-sm font-medium text-gray-700">Reason</label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason for the arrangement request"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            rows="3"
          />
        </div>

        <Button type="submit">Submit Request</Button>
      </form>
    </div>
  );
}