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

    const formatDateRange = (start, end) => {
        const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        return `${startStr} - ${endStr}`;
    };

    const generateWeekOptions = () => {
        const options = [];
        const currentYear = currentDate.getFullYear();
        const startDate = new Date(currentYear - 1, 0, 1);
        const endDate = new Date(currentYear + 1, 11, 31);

        for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 7)) {
            const weekStart = getWeekStart(d);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            
            options.push({
                value: weekStart.toISOString(),
                label: formatDateRange(weekStart, weekEnd)
            });
        }
        return options;
    };

    const generateMonthOptions = () => {
        const options = [];
        const currentYear = currentDate.getFullYear();
        for (let year = currentYear - 1; year <= currentYear + 1; year++) {
            for (let month = 0; month < 12; month++) {
                const date = new Date(year, month, 1);
                options.push({
                    value: date.toISOString(),
                    label: date.toLocaleString('default', { month: 'long', year: 'numeric' })
                });
            }
        }
        return options;
    };

    const handleDateChange = (e) => {
        const newDate = new Date(e.target.value);
        setCurrentDate(newDate);
    };

    const getDropdownValue = () => {
        if (viewMode === 'week') {
            return getWeekStart(currentDate).toISOString();
        } else {
            return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
        }
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
                        value={getDropdownValue()}
                        onChange={handleDateChange}
                        className="p-2 border rounded"
                    >
                        {viewMode === 'week' 
                            ? generateWeekOptions().map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                              ))
                            : generateMonthOptions().map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                              ))
                        }
                    </select>
                    <button
                        onClick={returnToCurrent}
                        className="p-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
                    >
                        <Calendar className="h-5 w-5 mr-1" />
                        Today
                    </button>
                    <select
                        value={viewMode}
                        onChange={(e) => setViewMode(e.target.value)}
                        className="p-2 border rounded"
                    >
                        <option value="week">Week</option>
                        <option value="month">Month</option>
                    </select>
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
                    const dayWorkMode = workMode[formattedDate] || "N/A";  // Get the work mode for this specific date

                    return (
                        <DayCard
                            key={day.toISOString()}
                            day={day}
                            workMode={dayWorkMode}  // Pass the work mode based on the formatted date
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
