const DayCard = ({ day, workMode, isCurrentMonth, isToday, isWeekend, status }) => (
  <div
    className={`rounded shadow overflow-hidden ${
      isCurrentMonth ? "" : "opacity-50"
    } ${isToday ? "border-2 border-blue-500" : ""} ${
      isWeekend ? "opacity-50" : ""
    }`}
  >
    <div className="bg-gray-100 p-2">
      <h3 className={`font-bold ${isToday ? "text-blue-600" : ""}`}>
        {day.getDate()}
      </h3>
      <p className="text-xs">
        {day.toLocaleDateString("en-US", { weekday: "long" })}
      </p>
    </div>
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
    </div>
    
    <div className="p-2 text-center">
      <p
        className={`text-xs font-semibold ${
          status === "Pending" ? "text-yellow-500" : "text-green-600"
        }`}
      >
        {status === "N/A" ? "" : `Status: ${status}`}
      </p>
    </div>
    
  </div>
);

export default DayCard;
