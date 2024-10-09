import React from "react";

export default function WFHApplicationForm({
  wfhForm,
  minWFHDate,
  maxWFHDate,
  maxRecurringWeeks,
  handleWfhInputChange,
  handleWfhSubmit,
}) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">WFH Application Form</h2>
      <form onSubmit={handleWfhSubmit}>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="date"
          >
            Start Date
          </label>
          <input
            type="date"
            name="date"
            id="date"
            value={wfhForm.date}
            onChange={handleWfhInputChange}
            min={minWFHDate}
            max={maxWFHDate}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          <p className="mt-1 text-sm text-gray-500">
            You can apply for WFH between {minWFHDate} and {maxWFHDate}.
          </p>
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="duration"
          >
            Duration (in days)
          </label>
          <input
            type="number"
            name="duration"
            id="duration"
            value={wfhForm.duration}
            onChange={handleWfhInputChange}
            min="1"
            max="5"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="recurringWeeks"
          >
            Recurring Weeks
          </label>
          <input
            type="number"
            name="recurringWeeks"
            id="recurringWeeks"
            value={wfhForm.recurringWeeks}
            onChange={handleWfhInputChange}
            min="1"
            max={maxRecurringWeeks}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Maximum recurring weeks: {maxRecurringWeeks}
          </p>
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="reason"
          >
            Reason
          </label>
          <textarea
            name="reason"
            id="reason"
            rows="3"
            value={wfhForm.reason}
            onChange={handleWfhInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
