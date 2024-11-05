import React from 'react';

export default function TeamDayCard({ dayData, date, totalMembers, onClick }) {
  // Calculate in-office and WFH counts based on the schedule data for AM or PM
  // const inOfficeCount = dayData?.filter(schedule => schedule.arrangement === 'In-Office').length || 0;
  // const wfhCount = dayData?.filter(schedule => schedule.arrangement === 'WFH').length || 0;
  const inOfficeCount = dayData?.inoffice_count || 0;
  const wfhCount = dayData?.wfh_count || 0;
  return (
    <div 
      className="relative bg-blue-100 px-4 py-10 rounded-lg shadow-md h-full cursor-pointer hover:bg-blue-200 transition-colors"
      onClick={() => onClick(date, dayData)}
    >
      {dayData? (
        <>
          {/* Indicator for remote working */}
          {wfhCount > 0 && inOfficeCount < totalMembers && (
            <div 
              className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full" 
              title="Some team members are working remotely">
            </div>
          )}
          <p className="font-semibold">{inOfficeCount} in office</p>
          <p className="text-sm text-gray-600">out of {totalMembers} members</p>
        </>
      ) : (
        <p className="text-gray-500">No data</p>
      )}
    </div>
  );
}
