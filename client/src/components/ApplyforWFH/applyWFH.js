"use client"

import React, { useState, useEffect } from 'react'
import { Calendar } from "@/components/calendar"

export default function ApplyWFH() {
  const [selectedDates, setSelectedDates] = useState([])
  const [arrangement, setArrangement] = useState('Work from Home')
  const [session, setSession] = useState('AM')
  const [recurring, setRecurring] = useState('None')
  const [recurrenceCount, setRecurrenceCount] = useState(1)
  const [maxRecurrenceCount, setMaxRecurrenceCount] = useState(12)
  const [reason, setReason] = useState('')
  const [dateRange, setDateRange] = useState({ start: new Date(), end: new Date() })

  useEffect(() => {
    const currentDate = new Date()
    const twoMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, currentDate.getDate())
    const threeMonthsLater = new Date(currentDate.getFullYear(), currentDate.getMonth() + 3, currentDate.getDate())
    const weeksBetween = Math.floor((threeMonthsLater.getTime() - currentDate.getTime()) / (7 * 24 * 60 * 60 * 1000))
    setMaxRecurrenceCount(weeksBetween)
    setDateRange({ start: twoMonthsAgo, end: threeMonthsLater })
  }, [])

  const handleDateSelect = (dates) => {
    setSelectedDates(dates || [])
  }

  const clearSelectedDates = () => {
    setSelectedDates([])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Submitting:', { selectedDates, arrangement, session, recurring, recurrenceCount, reason })
    // Add your submission logic here
  }

  const isDateDisabled = (date) => {
    return date < dateRange.start || date > dateRange.end
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Select Dates</label>
          <Calendar
            mode="multiple"
            selected={selectedDates}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            className="rounded-md border"
          />
          <button
            type="button"
            onClick={clearSelectedDates}
            className="mt-2 w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Clear Selected Dates
          </button>
          <p className="mt-2 text-sm text-gray-600">
            Selected dates: {selectedDates.map(date => date.toDateString()).join(", ")}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            You can select dates from {dateRange.start.toDateString()} to {dateRange.end.toDateString()}
          </p>
        </div>

        <div>
          <label htmlFor="arrangement" className="block text-sm font-medium text-gray-700">Arrangement</label>
          <select
            id="arrangement"
            value={arrangement}
            onChange={(e) => setArrangement(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option>Work from Home</option>
            <option>Office</option>
          </select>
        </div>

        <div>
          <label htmlFor="session" className="block text-sm font-medium text-gray-700">Session</label>
          <select
            id="session"
            value={session}
            onChange={(e) => setSession(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option>AM</option>
            <option>PM</option>
            <option>Full Day</option>
          </select>
        </div>

        <div>
          <label htmlFor="recurring" className="block text-sm font-medium text-gray-700">Recurring</label>
          <select
            id="recurring"
            value={recurring}
            onChange={(e) => setRecurring(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option>None</option>
            <option>Weekly</option>
            <option>Bi-weekly</option>
            <option>Monthly</option>
          </select>
        </div>

        {recurring !== 'None' && (
          <div>
            <label htmlFor="recurrenceCount" className="block text-sm font-medium text-gray-700">Number of Recurrences</label>
            <input
              type="number"
              id="recurrenceCount"
              value={recurrenceCount}
              onChange={(e) => setRecurrenceCount(Math.min(Math.max(1, parseInt(e.target.value) || 1), maxRecurrenceCount))}
              min="1"
              max={maxRecurrenceCount}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <p className="mt-1 text-sm text-gray-500">Maximum recurrences: {maxRecurrenceCount}</p>
          </div>
        )}

        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason</label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Enter reason for the arrangement request"
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit Request
        </button>
      </form>
    </div>
  )
}