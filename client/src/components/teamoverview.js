import React from 'react';
import { X } from 'lucide-react';

export default function TeamOverview({ isOpen, onClose, date, teamData, allTeamMembers }) {
  if (!isOpen) return null;

  // Create a map of WFH members based on the teamData (which contains the schedules)
  const wfhMap = teamData.reduce((acc, member) => {
    acc[member.member_id] = member.arrangement; // Store the arrangement (WFH) by member_id
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Team Status for {date}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <div className="overflow-y-auto max-h-96">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {allTeamMembers.length > 0 ? (
                allTeamMembers.map((member, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-4 py-2">{`${member.staff_fname} ${member.staff_lname}`}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded ${
                          wfhMap[member.staff_id] === 'WFH' ? 'bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800'
                        }`}
                      >
                        {wfhMap[member.staff_id] === 'WFH' ? 'WFH' : 'In Office'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="px-4 py-2 text-center">No team members available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
