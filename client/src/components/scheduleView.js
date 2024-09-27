import DayCard from "./daycard";
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

const ScheduleView = ({ schedule, workMode, currentDate, viewMode, navigate, returnToCurrent, setViewMode, setCurrentDate }) => {
    const isToday = (date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    };

    const isWeekend = (date) => {
        const day = date.getDay();
        return day === 0 || day === 6;
    };

    const getWeekStart = (date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <button 
                    onClick={() => navigate('prev')}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex items-center space-x-4">
                    <select
                        value={viewMode}
                        onChange={(e) => setViewMode(e.target.value)}
                        className="p-2 border rounded"
                    >
                        <option value="week">Week</option>
                        <option value="month">Month</option>
                    </select>
                    <button
                        onClick={returnToCurrent}
                        className="p-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
                    >
                        <Calendar className="h-5 w-5 mr-1" />
                        Today
                    </button>
                </div>
                <button 
                    onClick={() => navigate('next')}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>
            <div className="grid grid-cols-7 gap-4">
                {schedule.map((day) => {
                    const formattedDate = formatDate(day);  // Format the day as a date string
                    const dayData = workMode[formattedDate];  // Get the work mode and status for this specific date

                    // Set default values if no arrangement is found for the date
                    const dayWorkMode = dayData ? dayData.mode : "In Office";
                    const dayStatus = dayData ? dayData.status : "N/A";

                    return (
                        <DayCard
                            key={day.toISOString()}
                            day={day}
                            workMode={dayWorkMode}  // Pass the work mode based on the formatted date
                            status={dayStatus}      // Pass the status based on the formatted date
                            isCurrentMonth={day.getMonth() === currentDate.getMonth()}
                            isToday={isToday(day)}
                            isWeekend={isWeekend(day)}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default ScheduleView;
