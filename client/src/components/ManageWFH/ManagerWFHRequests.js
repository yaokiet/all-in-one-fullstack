import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ManageCard from "./manageCard";

export default function ManagerWFHRequests() {
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [signal, setSignal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      console.log("START");
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/apply/manager?filter=${activeTab}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched Data:", data);
          setRequests(data.arrangements || []); // Update state with fetched data
        } else {
          console.error(
            "Failed to fetch data:",
            response.statusText || "Unknown error"
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    setSignal(false);

    fetchRequests();
  }, [activeTab, signal]);

  return (
    <div className="bg-gray-100 rounded-lg shadow-md container mx-auto p-5">
      <div className="mb-6">
        <h1 className="text-xl font-bold">Work From Home Requests</h1>
      </div>

      <div className="flex mb-4 space-x-2">
        {["Pending", "Approved", "Rejected"].map((tab) => (
          <motion.button
            key={tab}
            className={`px-4 py-2 rounded-md ${
              activeTab.toLowerCase() === tab.toLowerCase()
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab(tab.toLowerCase())}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            {tab}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {requests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.1, delay: index * 0.1 }}
            >
              <ManageCard request={request} setSignal={setSignal} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
