import React from 'react';

export default function TeamDayCard({ dayData, date, onClick }) {
  return (
    <div 
      className="relative bg-blue-100 p-4 rounded-lg shadow-md h-full cursor-pointer hover:bg-blue-200 transition-colors"
      onClick={() => onClick(date, dayData)}
    >
      {dayData ? (
        <>
          {/* Indicator for remote working */}
          {dayData.in_office_count !== dayData.total_members && (
            <div 
              className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full" 
              title="Some team members are working remotely">
            </div>
          )}
          <p className="font-semibold">{dayData.in_office_count} in office</p>
          <p className="text-sm text-gray-600">out of {dayData.total_members}</p>
        </>
      ) : (
        <p className="text-gray-500">No data</p>
      )}
    </div>
  );
}
