import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, User } from "lucide-react";
import Modal from "../components/modal"; // Import the Modal component

export default function RequestCard({
  request,
  superviserName,
  setDeleteSignal,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

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

  const handleWithdraw = () => {
    // Open the modal
    setIsModalOpen(true);
  };

  const handleConfirmWithdraw = async () => {
    // Log to check if the function is triggered
    console.log("Withdrawal request initiated");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/apply/${request.arrangement_id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Request withdrawn successfully:", data);
        setDeleteSignal(true);
      } else {
      }
    } catch (error) {
      console.error("Withdrawal failed:", error);
    }
    setIsModalOpen(false);
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
        <div className="flex items-center space-x-6 text-base text-gray-600">
          <div className="flex items-center">
            <CalendarDays className="mr-2 h-5 w-5 text-gray-400" />
            <span>{request.arrangement_date}</span>
          </div>

          <div className="flex items-center">
            <User className="mr-2 h-5 w-5 text-gray-400" />
            <span>{superviserName}</span>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
        {/* Conditionally render the Withdraw Request button if the status is NOT 'approved' */}
        {request.status.toLowerCase() !== "approved" && (
          <button
            onClick={handleWithdraw}
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Withdraw Request
          </button>
        )}
      </div>

      {/* Modal for confirming the withdrawal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmWithdraw}
        title="Confirm Withdrawal"
        message="Are you sure you want to withdraw this request?"
        buttonMessage="Withdraw"
      />
    </div>
  );
}
