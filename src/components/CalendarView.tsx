import React from "react";

interface CalendarViewProps {
  taskHistory: { [key: string]: any };
  onDateSelect: (date: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  taskHistory,
  onDateSelect,
}) => {
  const todayDate = new Date().toISOString().split("T")[0];
  const dates = Object.keys(taskHistory).sort((a, b) => (a > b ? -1 : 1));

  return (
    <div>
      {/* <button
        onClick={() => onDateSelect(todayDate)}
        className="w-full bg-indigo-600 text-white py-2 mb-4"
      >
        Today's Tasks
      </button> */}
      <ul>
        {dates.map((date) => (
          <li key={date}>
            <button onClick={() => onDateSelect(date)}>{date}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CalendarView;
