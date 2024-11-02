import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function TeamOverview({
  isOpen,
  onClose,
  date,
  teamData,
  allTeamMembers,
}) {
  const modalRef = useRef(null);

  // Create a map of WFH members based on the teamData (which contains the schedules)
  const wfhMap = teamData.reduce((acc, member) => {
    acc[member.member_id] = [member.arrangement, member.arrangement_status]; // Store the arrangement (WFH) by member_id
    console.log("acc: ", acc);
    return acc;
  }, {});

  // Handle Escape key press to close the modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose(); // Close modal on Escape key press
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Handle clicks outside the modal to close it
  const handleOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose(); // Close modal on outside click
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOutsideClick} // Attach the outside click handler to the background
    >
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Team Status for {date}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
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
