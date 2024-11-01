// src/components/TeamsView.js
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApplyWFHModal from "@/components/ApplyWFHModal";
import OverallView from "../ViewOverallSchedule/overallSchedule"; // Ensure the path is correct

export default function TeamsView({ currentDate }) {
  const [requests, setRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [superviserName, setSuperviserName] = useState("");
  const [deleteSignal, setDeleteSignal] = useState(false);
  const [requestSignal, setRequestSignal] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);

  // Define support team managers
  const supportTeamManagers = [
    { name: "Manager", am: "AM", pm: "PM" },
    { name: "Donald Trump", am: "85/100", pm: "15/100" },
  ];

  // Fetch requests based on activeTab
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/apply?filter=${activeTab}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (response.ok) {
          setRequests(data.arrangements);
          setSuperviserName(data.manager_name);
        } else {
          console.error("Failed to fetch data:", data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchRequests();
    setDeleteSignal(false);
    setRequestSignal(false);
  }, [activeTab, deleteSignal, requestSignal]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleManagerClick = (manager) => {
    setSelectedManager(manager);
    if (isModalOpen) {
      closeModal();
    }
  };

  const handleBackClick = () => {
    setSelectedManager(null);
  };

  return (
    <div className="bg-gray-100 rounded-lg shadow-md container mx-auto p-5">
      {!selectedManager ? ( // Conditionally render the table or the overall view
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold">Teams View</h1>
          </div>
          <table className="min-w-full bg-white border table-fixed">
            <tbody>
              {/* Support Team Row Spanning Two Rows */}
              <tr>
                <td
                  rowSpan={supportTeamManagers.length}
                  className="px-4 py-4 border text-center align-middle"
                >
                  Support Team
                </td>
                <td className="px-4 py-4 border text-center">
                  {supportTeamManagers[0].name} {/* Changed to plain text */}
                </td>
                <td className="px-4 py-4 border text-center">{supportTeamManagers[0].am}</td>
                <td className="px-4 py-4 border text-center">{supportTeamManagers[0].pm}</td>
              </tr>
              {supportTeamManagers.slice(1).map((manager, index) => (
                <tr key={index + 1} className="cursor-pointer">
                  <td
                    onClick={() => handleManagerClick(manager)} // Only handle click here
                    className="px-4 py-4 border text-center text-blue-500 hover:underline"
                  >
                    {manager.name}
                  </td>
                  <td className="px-4 py-4 border text-center">{manager.am}</td>
                  <td className="px-4 py-4 border text-center">{manager.pm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        // If a manager is selected, show their overall view
        <div className="mt-4">
          <button onClick={handleBackClick} className="mb-4 text-blue-500 hover:underline">
            &larr; Back to Team View
          </button>
          <OverallView
            currentDate={currentDate}
            selectedManager={selectedManager}
            goBack={handleBackClick}
          />
        </div>
      )}

      {/* Modal with Animation */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <ApplyWFHModal
              isOpen={isModalOpen}
              onClose={closeModal}
              setRequestSignal={setRequestSignal}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}










