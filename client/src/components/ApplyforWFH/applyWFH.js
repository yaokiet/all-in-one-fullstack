"use client"

import React, { useState } from 'react'
import ApplyWFHModal from './ApplyWFHModal'

export default function ScheduleManagement() {
  const [activeTab, setActiveTab] = useState('upcoming')
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  const openApplyModal = () => {
    setIsApplyModalOpen(true)
  }

  const closeApplyModal = () => {
    setIsApplyModalOpen(false)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <nav className="mt-5">
          <a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-200">View own schedule</a>
          <a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-200">Apply for WFH</a>
          <a href="#" className="block py-2 px-4 text-gray-700 hover:bg-gray-200">View overall schedule</a>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => handleTabChange('upcoming')}
              className={`px-4 py-2 rounded ${
                activeTab === 'upcoming' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => handleTabChange('pending')}
              className={`px-4 py-2 rounded ${
                activeTab === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              Pending
            </button>
          </div>
          <button
            onClick={openApplyModal}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Apply+
          </button>
        </div>

        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Manager Name</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Sample data - replace with actual data */}
            <tr>
              <td className="py-2 px-4 border-b">2023-05-15</td>
              <td className="py-2 px-4 border-b">John Doe</td>
              <td className="py-2 px-4 border-b">Approved</td>
              <td className="py-2 px-4 border-b">
                <button className="text-blue-500 hover:text-blue-700 mr-2">Change</button>
                <button className="text-red-500 hover:text-red-700">Withdraw</button>
              </td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>

      {/* Apply WFH Modal */}
      <ApplyWFHModal isOpen={isApplyModalOpen} onClose={closeApplyModal} />
    </div>
  )
}