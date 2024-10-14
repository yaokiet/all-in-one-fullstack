import React from 'react'
import { CalendarDays, Clock, User, Repeat } from 'lucide-react'

export default function RequestCard({ request }) {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-500'
      case 'pending':
        return 'bg-yellow-500'
      case 'rejected':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-full mb-4">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">{request.type}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${getStatusColor(request.status)}`}>
            {request.status}
          </span>
        </div>
        <div className="flex items-center space-x-6 text-base text-gray-600">
          <div className="flex items-center">
            <CalendarDays className="mr-2 h-5 w-5 text-gray-400" />
            <span>{request.date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-gray-400" />
            <span>{request.time}</span>
          </div>
          <div className="flex items-center">
            <User className="mr-2 h-5 w-5 text-gray-400" />
            <span>{request.approvingManager}</span>
          </div>
          <div className="flex items-center">
            <Repeat className="mr-2 h-5 w-5 text-gray-400" />
            <span>{request.recurrence}</span>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Edit
        </button>
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}