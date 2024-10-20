import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RequestCard from "@/components/requestCard";
import ApplyWFHModal from "@/components/ApplyWFHModal";

export default function ApplyWFH() {
  const [requests, setRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [superviserName, setSuperviserName] = useState("");
  const [deleteSignal, setDeleteSignal] = useState(false);
  const [requestSignal, setRequestSignal] = useState(false);

  useEffect(() => {
    // Fetch data from the backend based on activeTab
    const fetchRequests = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/apply?filter=${activeTab}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (response.ok) {
          setRequests(data.arrangements);
          setSuperviserName(data.manager_name);
          console.log(data);
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
  }, [activeTab, deleteSignal, requestSignal]); // Fetches data whenever the tab changes

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-gray-100 rounded-lg shadow-md container mx-auto p-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Work From Home Requests</h1>
        <button
          type="button"
          onClick={openModal}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          New Request
        </button>
      </div>
      <div className="flex mb-4">
        <motion.button
          className={`px-4 py-2 mr-2 rounded-md ${
            activeTab === "upcoming"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("upcoming")}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
        >
          Upcoming
        </motion.button>
        <motion.button
          className={`px-4 py-2 rounded-md ${
            activeTab === "past"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("past")}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
        >
          Past
        </motion.button>
      </div>

      {/* Request Cards with Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {requests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.1, delay: index * 0.1 }}
            >
              <RequestCard
                request={request}
                superviserName={superviserName}
                setDeleteSignal={setDeleteSignal}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

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
