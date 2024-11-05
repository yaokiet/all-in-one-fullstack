import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function TeamOverview({
  isOpen,
  onClose,
  date,
  teamData,
  ampm,
  allTeamMembers,
}) {
  const modalRef = useRef(null);
  // Filter teamData based on AM or PM and create a WFH map
  const filteredTeamData = teamData.filter((entry) => entry.am_pm == ampm); // Filter by AM or PM
  const wfhMap = filteredTeamData.reduce((acc, member) => {
    acc[member.member_id] = [member.arrangement, member.arrangement_status];
    return acc;
  }, {});

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOutsideClick}
    >
      <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Team Status for {date} ({ampm})</h2>
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
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-4 py-2">{`${member.staff_fname} ${member.staff_lname}`}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded ${
                          wfhMap[member.staff_id] &&
                          wfhMap[member.staff_id][0] === "WFH" &&
                          wfhMap[member.staff_id][1] === "Approved"
                            ? "bg-green-200 text-green-800"
                            : "bg-blue-200 text-blue-800"
                        }`}
                      >
                        {wfhMap[member.staff_id] &&
                        wfhMap[member.staff_id][0] === "WFH" &&
                        wfhMap[member.staff_id][1] === "Approved"
                          ? "WFH"
                          : "Office"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="px-4 py-2 text-center">
                    No team members available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
