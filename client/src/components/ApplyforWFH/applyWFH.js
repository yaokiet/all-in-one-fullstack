import React, { useState, useEffect } from "react";
import RequestCard from "@/components/requestCard";
import ApplyWFHModal from "@/components/ApplyWFHModal";

export default function ApplyWFH() {
  const [requests, setRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [superviserName, setSuperviserName] = useState("");
  const [deleteSignal, setDeleteSignal] = useState(false);

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
  }, [activeTab, deleteSignal]); // Fetches data whenever the tab changes

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
          className="inline-flex justify-center rounded-md border border-transparent bg-[#6C7BF2] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#5A68D2] focus:outline-none focus:ring-2 focus:ring-[#6C7BF2] focus:ring-offset-2"
        >
          New Request
        </button>
      </div>
      <div className="flex mb-4">
        <button
          className={`px-4 py-2 mr-2 rounded-md ${
            activeTab === "upcoming"
              ? "bg-[#6C7BF2] text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            activeTab === "past"
              ? "bg-[#6C7BF2] text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("past")}
        >
          Past
        </button>
      </div>
      <div className="space-y-6">
        {requests.map((request) => (
          <RequestCard
            key={request.id}
            request={request}
            superviserName={superviserName}
            setDeleteSignal={setDeleteSignal}
          />
        ))}
      </div>
      <ApplyWFHModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
