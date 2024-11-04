import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ManageCard from "./manageCard";

export default function ManagerWFHRequests() {
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [error, setError] = useState(null);

  // Dummy data for testing
  const dummyRequests = [
    {
      id: 240,
      employeeName: "Derek Tan",
      date: "2024-10-30",
      status: "Pending",
      reason: "Need to focus on project deadlines",
      rejectionReason: null,
    },
    {
      id: 241,
      employeeName: "Sarah Lee",
      date: "2024-10-31",
      status: "Approved",
      reason: "Team meeting and planning session",
      rejectionReason: null,
    },
    {
      id: 242,
      employeeName: "John Smith",
      date: "2024-11-01",
      status: "Rejected",
      reason: "Important on-site meeting",
      rejectionReason: "Physical presence required for client meeting",
    },
  ];

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

    fetchRequests();
  }, [activeTab]);

  const handleEdit = (requestId) => {
    console.log("Edit request:", requestId);
    // Implement edit functionality here
  };

  const handleApprove = (requestId) => {
    console.log("Approve request:", requestId);
    // Implement approve functionality here
  };

  const handleReject = (requestId) => {
    console.log("Reject request:", requestId);
    // Implement reject functionality here
  };

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
              <ManageCard request={request} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
