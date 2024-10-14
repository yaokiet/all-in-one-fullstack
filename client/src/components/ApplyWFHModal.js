"use client"

import React, { useState, useEffect } from 'react'
import { Calendar } from "@/components/calendar"
import { X } from 'lucide-react'

export default function ApplyWFHModal({ isOpen, onClose }) {
  const [selectedDates, setSelectedDates] = useState([])
  const [arrangement, setArrangement] = useState('Work from Home')
  const [session, setSession] = useState('AM')
  const [recurring, setRecurring] = useState('None')
  const [maxRecurring, setMaxRecurring] = useState(1)
  const [reason, setReason] = useState('')
  const [dateRange, setDateRange] = useState({ start: new Date(), end: new Date() })

  useEffect(() => {
    const currentDate = new Date()
    const twoMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 2, 1)
    const nextJanuary = new Date(currentDate.getFullYear() + 1, 0, 31)
    setDateRange({ start: twoMonthsAgo, end: nextJanuary })
  }, [])

  const calculateMaxRecurring = (startDate, recurringType) => {
    if (!startDate || recurringType === 'None') {
      return 1
    }

    const endDate = dateRange.end
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    switch (recurringType) {
      case 'Weekly':
        return Math.floor(daysDiff / 7) + 1
      case 'Bi-weekly':
        return Math.floor(daysDiff / 14) + 1
      case 'Monthly':
        return Math.floor((endDate.getMonth() - startDate.getMonth() + (12 * (endDate.getFullYear() - startDate.getFullYear()))) + 1)
      default:
        return 1
    }
  }

  const handleDateSelect = (dates) => {
    setSelectedDates(dates || [])
    if (dates && dates.length > 0) {
      const newMaxRecurring = calculateMaxRecurring(dates[0], recurring)
      setMaxRecurring(newMaxRecurring)
    }
  }

  const handleRecurringChange = (e) => {
    const newRecurring = e.target.value
    setRecurring(newRecurring)
    if (selectedDates.length > 0) {
      const newMaxRecurring = calculateMaxRecurring(selectedDates[0], newRecurring)
      setMaxRecurring(newMaxRecurring)
    }
  }

  const clearSelectedDates = () => {
    setSelectedDates([])
    setMaxRecurring(1)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Submitting:', { selectedDates, arrangement, session, recurring, maxRecurring, reason })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Apply for Work From Home</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center">
            <label className="block mb-2 text-sm font-medium text-gray-700">Select Dates</label>
            <div className="w-full max-w-sm">
              <Calendar
                mode="multiple"
                selected={selectedDates}
                onSelect={handleDateSelect}
                className="rounded-md border"
                fromDate={dateRange.start}
                toDate={dateRange.end}
              />
            </div>
            <button
              type="button"
              onClick={clearSelectedDates}
              className="mt-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Clear Selected Dates
            </button>
            <p className="mt-2 text-sm text-gray-600">
              Selected dates: {selectedDates.map(date => date.toDateString()).join(", ")}
            </p>
          </div>

          <div className="w-full max-w-sm mx-auto">
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

          <div className="w-full max-w-sm mx-auto">
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

          <div className="w-full max-w-sm mx-auto">
            <label htmlFor="recurring" className="block text-sm font-medium text-gray-700">Recurring</label>
            <select
              id="recurring"
              value={recurring}
              onChange={handleRecurringChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option>None</option>
              <option>Weekly</option>
              <option>Bi-weekly</option>
              <option>Monthly</option>
            </select>
          </div>

          {recurring !== 'None' && (
            <div className="w-full max-w-sm mx-auto">
              <label htmlFor="maxRecurring" className="block text-sm font-medium text-gray-700">Maximum Recurring Times</label>
              <input
                type="number"
                id="maxRecurring"
                value={maxRecurring}
                onChange={(e) => setMaxRecurring(Math.max(1, Math.min(parseInt(e.target.value), maxRecurring)))}
                min="1"
                max={maxRecurring}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <p className="mt-1 text-sm text-gray-500">Maximum possible recurrences: {maxRecurring}</p>
            </div>
          )}

          <div className="w-full max-w-sm mx-auto">
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

          <div className="w-full max-w-sm mx-auto">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}