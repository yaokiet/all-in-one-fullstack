import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import { Textarea } from "@nextui-org/react";

export default function ManageModal({
  isOpen,
  onClose,
  type,
  title,
  message,
  buttonMessage,
  requestId, // Pass in the arrangement ID
  setSignal,
}) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      let response;
      if (type === "approve") {
        console.log("approve");
        console.log(requestId);
        response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/apply/manager`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              arrangement_id: requestId,
              status: "Approved",
              manager_reason: "",
            }),
          }
        );
      } else if (type === "reject") {
        console.log("reject");
        response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/apply/manager`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              arrangement_id: requestId,
              status: "Rejected",
              manager_reason: reason,
            }),
          }
        );
      } else if (type === "withdraw") {
        console.log("withdraw");
        response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/apply/${requestId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );
      }

      if (response.ok) {
        const data = await response.json();
        console.log(`${type} request successful:`, data);
      } else {
        console.error(`Failed to ${type} request:`, response.statusText);
      }
    } catch (error) {
      console.error(`${type} request failed:`, error);
    } finally {
      setLoading(false);
      setSignal(true);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          {title}
        </h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">{message}</p>

        {type === "reject" && (
          <div className="mb-4">
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Rejection Reason
            </label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a reason for rejection"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant={type === "approve" ? "default" : "destructive"}
            disabled={(type === "reject" && reason.trim() === "") || loading}
          >
            {loading ? "Processing..." : buttonMessage}
          </Button>
        </div>
      </div>
    </div>
  );
}
