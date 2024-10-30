"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

export default function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  setSelectedDates,
  ...props
}) {
  const today = new Date();
  const fromDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
  const toDate = new Date(today.getFullYear() + 1, 0, 31); // January 31st of next year

  const [month, setMonth] = React.useState(today);

  const handleMonthChange = (newMonth) => {
    if (newMonth >= fromDate && newMonth <= toDate) {
      setMonth(newMonth);
    }
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={`p-3 ${className}`}
      classNames={{
        months:
          "flex flex-col-reverse items-center gap-3 space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button:
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: "text-center h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground border-2 border-primary",
        day_outside: "text-muted-foreground opacity-50 bg-muted",
        day_disabled: "text-muted-foreground opacity-50 cursor-not-allowed",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      modifiersClassNames={{
        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        today: "bg-accent text-accent-foreground border-2 border-primary",
        outside: "text-muted-foreground opacity-50 bg-muted",
        disabled: "text-muted-foreground opacity-50 cursor-not-allowed",
      }}
      fromDate={fromDate}
      toDate={toDate}
      month={month}
      onMonthChange={handleMonthChange}
      disabled={(date) => date < fromDate || date > toDate}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
