"use client";

import React, { useState } from 'react';
import ScheduleView from './scheduleView';
import ApplyWFH from '../ApplyforWFH/applyWFH';

export default function ViewRequest({ schedule, workMode, currentDate, viewMode, navigate, returnToCurrent, setViewMode, error }) {
  const [showApplyWFH, setShowApplyWFH] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');

  const handleApplyClick = () => {
    setShowApplyWFH(true);
  };

  const handleCloseApplyWFH = () => {
    setShowApplyWFH(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button
            onClick={() => handleTabChange('upcoming')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'upcoming'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => handleTabChange('pending')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'pending'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pending
          </button>
        </div>
        <button
          onClick={handleApplyClick}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Apply+
        </button>
      </div>
      
      {activeTab === 'upcoming' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Upcoming Schedules</h2>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Manager Name
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Sample data - replace with actual data */}
              <tr>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                  2024-10-15
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                  John Doe
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                  Approved
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                  <button className="text-blue-600 hover:text-blue-900">Change</button>
                  <button className="ml-2 text-red-600 hover:text-red-900">Withdraw</button>
                </td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      )}
      
      {activeTab === 'pending' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Pending Requests</h2>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Manager Name
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Sample data - replace with actual data */}
              <tr>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                  2024-10-20
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                  Jane Smith
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                  Pending
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                  <button className="text-blue-600 hover:text-blue-900">Change</button>
                  <button className="ml-2 text-red-600 hover:text-red-900">Withdraw</button>
                </td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      )}
      
      <ScheduleView
        schedule={schedule}
        workMode={workMode}
        currentDate={currentDate}
        viewMode={viewMode}
        navigate={navigate}
        returnToCurrent={returnToCurrent}
        setViewMode={setViewMode}
        error={error}
      />
      {showApplyWFH && (
        <ApplyWFH onClose={handleCloseApplyWFH} />
      )}
    </div>
  );
}