import React, { useState } from "react";
import { CalendarDays, User } from "lucide-react";
import ManageModal from "./manageModal";

export default function ManageCard({ request, setSignal }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleOpenModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-full mb-4">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">
            Application ID: {request.arrangement_id}
          </h3>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${getStatusColor(
              request.status
            )}`}
          >
            {request.status}
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <CalendarDays className="mr-2 h-5 w-5 text-gray-400" />
            <span className="mr-2">{request.arrangement_date}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <User className="mr-2 h-5 w-5 text-gray-400" />
            <span>{request.fullname}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <span className="mr-2">📝</span>
            <span>Reason: {request.reason}</span>
          </div>
          {request.status === "Rejected" && (
            <div className="flex items-center text-red-600">
              <span className="mr-2">❌</span>
              <span>Rejection Reason: {request.manager_reason}</span>
            </div>
          )}
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
        {request.status.toLowerCase() !== "pending" && (
          <button
            onClick={() => handleOpenModal("withdraw")}
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete Request
          </button>
        )}
        {request.status.toLowerCase() === "pending" && (
          <>
            <button
              className={`px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                request.is_above_threshold
                  ? "bg-gray-300 cursor-not-allowed focus:ring-gray-300"
                  : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"
              }`}
              onClick={() =>
                !request.is_above_threshold && handleOpenModal("approve")
              }
              disabled={request.is_above_threshold}
            >
              Approve
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              onClick={() => handleOpenModal("reject")}
            >
              Reject
            </button>
          </>
        )}
      </div>

      <ManageModal
        setSignal={setSignal}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        type={modalType}
        title={`Confirm ${
          modalType.charAt(0).toUpperCase() + modalType.slice(1)
        }`}
        message={`Are you sure you want to ${modalType} this request?`}
        buttonMessage={modalType.charAt(0).toUpperCase() + modalType.slice(1)}
        requestId={request.arrangement_id}
      />
    </div>
  );
}
