import moment from "moment";
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
      <ul>
        {dates.map((date) => (
          <li key={date}>
            <button
              className="w-full bg-gray-700 text-white py-2 mb-4 rounded hover:bg-gray-900"
              onClick={() => onDateSelect(date)}
            >
              {moment(date).format("ddd D MMM YYYY")}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CalendarView;
