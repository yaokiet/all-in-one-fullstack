const DayCard = ({ day, workMode, isCurrentMonth, isToday, isWeekend, status }) => (
  <div
    className={`rounded shadow overflow-hidden ${
      isCurrentMonth ? "" : "opacity-50"
    } ${isToday ? "border-2 border-blue-500" : ""} ${
      isWeekend ? "opacity-50" : ""
    }`}
  >
    {/* Date and Day */}
    <div className="bg-gray-100 p-2">
      <h3 className={`font-bold ${isToday ? "text-blue-600" : ""}`}>
        {day.getDate()}
      </h3>
      <p className="text-xs">
        {day.toLocaleDateString("en-US", { weekday: "long" })}
      </p>
    </div>
    
    {/* Work Mode and Status */}
    <div
      className={`p-2 ${
        isWeekend
          ? "bg-gray-200 h-full"
          : workMode === "Office"
          ? "bg-blue-200 h-full"
          : "bg-green-200 h-full"
      }`}
    >
      <p className="font-medium text-sm">{isWeekend ? "Weekend" : workMode}</p>
      
      {/* Status Rendering with Color (Only if it's not a weekend) */}
      {!isWeekend && status !== "N/A" && (
        <div
          className={`text-sm font-semibold ${
            status === "Pending"
              ? "text-yellow-500"
              : status === "Approved"
              ? "text-green-600"
              : status === "Rejected"
              ? "text-red-500"
              : ""
          }`}
        >
          {status}
        </div>
      )}
    </div>
  </div>
);

export default DayCard;
