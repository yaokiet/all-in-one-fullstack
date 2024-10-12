export default function TeamEmployeeDayCard({ employee, schedule, date, onClick }) {
  // If employee or employee.name is missing, provide a fallback
  const employeeName = employee?.name || 'Unknown Employee';
  const status = schedule ? (schedule.in_office ? 'In Office' : 'WFH') : 'N/A';
  const statusColor = status === 'In Office' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';

  return (
    <div 
      className="bg-white p-2 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => onClick(date)}
    >
      <p className="font-semibold text-sm truncate">{employeeName}</p>
      <span className={`text-xs px-2 py-1 rounded-full ${statusColor}`}>
        {status}
      </span>
    </div>
  );
}
