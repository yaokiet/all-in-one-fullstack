import React, { useState } from "react";
import { Calendar } from "@/components/calendar.js";

export default function ApplyWFHModal({ isOpen, onClose, setRequestSignal }) {
  const [selectedDates, setSelectedDates] = useState([]);
  const [session, setSession] = useState("AM");
  const [recurringWeeks, setRecurringWeeks] = useState(1);
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState({});

  const handleClose = () => {
    setRecurringWeeks(1);
    setSelectedDates([]);
    setReason("");
    setErrors({});
    onClose();
  };

  const handleRecurring = () => {
    const newDates = [...selectedDates];
    for (let i = 1; i < recurringWeeks; i++) {
      selectedDates.forEach((date) => {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + i * 7);
        newDates.push(newDate);
      });
    }
    setSelectedDates(newDates);
  };

  const clearSelectedDates = () => {
    setSelectedDates([]);
  };

  function formatDatesToYYYYMMDD(datesArray) {
    return datesArray.map((date) => {
      const d = new Date(date);
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      return d.toISOString().split("T")[0];
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (selectedDates.length === 0 || reason.trim() === "") {
      setErrors({
        dates:
          selectedDates.length === 0 ? "Please select at least one date" : "",
        reason: reason.trim() === "" ? "Please provide a reason" : "",
      });
      return;
    }

    console.log("selectedDates", selectedDates);

    const newSelectedDates = formatDatesToYYYYMMDD(selectedDates);
    console.log("newselected", newSelectedDates);

    const payload = {
      arrangement_dates: newSelectedDates,
      arrangement_type: "WFH",
      reason: reason,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Response from server:", data);
        setRequestSignal(true);
        handleClose();
      } else {
        console.error("Error:", data);
        if (response.status === 400) {
          setErrors({
            dates: data.message.includes("dates")
              ? "Please select at least one date"
              : "",
            reason: data.message.includes("reason")
              ? "Please provide a reason"
              : "",
          });
        } else if (response.status === 409) {
          setErrors({ dates: data.message });
        } else {
          setErrors({ general: "An error occurred. Please try again." });
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setErrors({ general: "An error occurred. Please try again." });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white h-5/6 overflow-y-scroll rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Apply for Work From Home</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="text-red-500 text-sm">{errors.general}</div>
          )}
          <div>
            <label
              htmlFor="dates"
              className="block text-sm font-medium text-gray-700"
            >
              Select Dates
            </label>
            <Calendar
              mode="multiple"
              selected={selectedDates}
              onSelect={setSelectedDates}
              className={`rounded-md border ${
                errors.dates ? "border-red-500" : ""
              }`}
            />
            {errors.dates && (
              <div className="text-red-500 text-sm mt-1">{errors.dates}</div>
            )}
          </div>

          <div>
            <label
              htmlFor="session"
              className="block text-sm font-medium text-gray-700"
            >
              Session
            </label>
            <select
              id="session"
              value={session}
              onChange={(e) => setSession(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
              <option value="Full Day">Full Day</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="recurringWeeks"
              className="block text-sm font-medium text-gray-700"
            >
              Recurring Weeks
            </label>
            <input
              type="number"
              id="recurringWeeks"
              value={recurringWeeks}
              onChange={(e) => setRecurringWeeks(Number(e.target.value))}
              min={1}
              max={12}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <div className="flex justify-between items-center mt-2">
              <button
                type="button"
                onClick={clearSelectedDates}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Clear Dates
              </button>
              <button
                type="button"
                onClick={handleRecurring}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Apply Recurring
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700"
            >
              Reason
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                errors.reason
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-indigo-300"
              }`}
              placeholder="Enter reason for the arrangement request"
            />
            {errors.reason && (
              <div className="text-red-500 text-sm mt-1">{errors.reason}</div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
