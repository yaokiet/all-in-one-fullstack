import React, { useState } from "react";
import { Calendar } from "@/components/calendar.js";

export default function ApplyWFHModal({ isOpen, onClose }) {
  const [selectedDates, setSelectedDates] = useState([]);
  const [session, setSession] = useState("AM");
  const [recurring, setRecurring] = useState("None");
  const [recurringOccurrences, setRecurringOccurrences] = useState(1);
  const [reason, setReason] = useState("");
  const [maxRecurring, setMaxRecurring] = useState(1);

  const handleDateSelect = (dates) => {
    setSelectedDates(dates);
    if (dates && dates.length > 0) {
      calculateMaxRecurring(dates[0], recurring);
    }
  };

  const handleRecurring = () => {
    for(i=1; i <= maxRecurring; i++) {
       for(j=1;j<selectedDates.length; j++) {
         const newDate = new Date(selectedDate[j]);
         newDate.setDate(newDate.getDate() + (i * 7));
         setSelectedDates([...selectedDates, newDate]);
       }
    }

  };

  const calculateMaxRecurring = (selectedDate, recurringType) => {
    const currentDate = new Date();
    const threeMonthsLater = new Date(currentDate);
    threeMonthsLater.setMonth(currentDate.getMonth() + 3);

    const timeDiff =
      threeMonthsLater.getTime() - new Date(selectedDate).getTime();
    const diffInDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    let maxRecurring = 1;

    if (recurringType === "Weekly") {
      maxRecurring = Math.floor(diffInDays / 7);
    } else if (recurringType === "Bi-weekly") {
      maxRecurring = Math.floor(diffInDays / 14);
    } else if (recurringType === "Monthly") {
      maxRecurring = Math.floor(diffInDays / 30);
    }

    setMaxRecurring(Math.max(1, maxRecurring));
  };

  function formatDatesToYYYYMMDD(datesArray) {
    return datesArray.map((date) => {
      // Convert each date to ISO string and extract the date portion
      return date.toISOString().split("T")[0];
    });
  }

  const handleSubmit = async () => {
    // Log selected dates
    console.log(selectedDates);

    // Format selected dates to YYYY-MM-DD
    const newSelectedDates = formatDatesToYYYYMMDD(selectedDates);
    console.log(newSelectedDates);

    // Create the payload for the POST request
    const payload = {
      arrangement_dates: newSelectedDates,
      arrangement_type: "WFH", // Use your desired type
      reason: "Take care of kids", // Use your desired reason
    };

    try {
      const response = await fetch("http://localhost:5000/apply", {
        method: "POST", // Specify the method
        headers: {
          "Content-Type": "application/json", // Specify the content type
        },
        body: JSON.stringify(payload), // Convert payload to JSON
        credentials: "include", // Include credentials for CORS
      });

      if (response.ok) {
        const data = await response.json(); // Parse the JSON response
        console.log("Response from server:", data); // Log the response
      } else {
        const errorData = await response.json(); // Get error details
        console.error("Error:", errorData);
        alert("Failed to submit request: " + errorData.message);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert(
        "An error occurred while submitting the request. Please try again."
      );
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white h-5/6 overflow-y-scroll rounded-lg p-6 w-full max-w-md ">
        <h2 className="text-2xl font-bold mb-4">Apply for Work From Home</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              onSelect={handleDateSelect}
              className="rounded-md border"
            />
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
              htmlFor="recurring"
              className="block text-sm font-medium text-gray-700"
            >
              Recurring
            </label>
            <select
              id="recurring"
              value={recurring}
              onChange={(e) => {
                setRecurring(e.target.value);
                if (selectedDates.length > 0) {
                  calculateMaxRecurring(selectedDates[0], e.target.value);
                }
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="None">None</option>
              <option value="Weekly">Weekly</option>
              <option value="Bi-weekly">Bi-weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>

          {recurring !== "None" && (
            <div>
              <label
                htmlFor="recurringOccurrences"
                className="block text-sm font-medium text-gray-700"
              >
                Recurring Occurrences
              </label>
              <input
                type="number"
                id="recurringOccurrences"
                value={recurringOccurrences}
                onChange={(e) =>
                  setRecurringOccurrences(Number(e.target.value))
                }
                min={1}
                max={maxRecurring}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <p className="mt-1 text-sm text-gray-500">
                Maximum possible recurrences: {maxRecurring}
              </p>
              <button
                type="button"
                onClick={handleRecurring}
                className="mt-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Apply Recurring
              </button>
            </div>
          )}

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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              placeholder="Enter reason for the arrangement request"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
