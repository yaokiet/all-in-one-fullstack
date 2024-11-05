export default function DayCard({
  day,
  isCurrentMonth,
  isToday,
  isWeekend,
  amData,
  pmData,
}) {
  return (
    <div
      className={`rounded shadow flex flex-col ${
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

      <div className="h-full">
        {/* AM Section */}
        <div
          className={`p-2 ${
            isWeekend
              ? "bg-gray-200"
              : amData?.status === "Approved"
              ? "bg-green-200"
              : amData?.status === "Pending"
              ? "bg-yellow-200"
              : amData?.status === "Rejected"
              ? "bg-red-200"
              : "bg-blue-200"
          }`}
        >
          <p className="font-medium text-sm">
            {isWeekend ? "Weekend" : amData?.mode || "Office"}
          </p>
          {!isWeekend && amData && (
            <div
              className={`text-sm font-semibold ${
                amData.status === "Pending"
                  ? "text-yellow-500"
                  : amData.status === "Approved"
                  ? "text-green-600"
                  : amData.status === "Rejected"
                  ? "text-red-500"
                  : ""
              }`}
            >
              {amData.status || "Office"}
            </div>
          )}
          <p className="text-xs">AM</p>
        </div>

        {/* PM Section */}
        <div
          className={`p-2 ${
            isWeekend
              ? "bg-gray-200"
              : pmData?.status === "Approved"
              ? "bg-green-200"
              : pmData?.status === "Pending"
              ? "bg-yellow-200"
              : pmData?.status === "Rejected"
              ? "bg-red-200"
              : "bg-blue-200"
          }`}
        >
          <p className="font-medium text-sm">
            {isWeekend ? "Weekend" : pmData?.mode || "Office"}
          </p>
          {!isWeekend && pmData && (
            <div
              className={`text-sm font-semibold ${
                pmData.status === "Pending"
                  ? "text-yellow-500"
                  : pmData.status === "Approved"
                  ? "text-green-600"
                  : pmData.status === "Rejected"
                  ? "text-red-500"
                  : ""
              }`}
            >
              {pmData.status || "Office"}
            </div>
          )}
          <p className="text-xs">PM</p>
        </div>
      </div>
    </div>
  );
}
