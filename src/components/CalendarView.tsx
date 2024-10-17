import React from "react";

interface CalendarViewProps {
  taskHistory: { [key: string]: any };
  onDateSelect: (date: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  taskHistory,
  onDateSelect,
}) => {
  const dates = Object.keys(taskHistory).sort((a, b) => (a > b ? -1 : 1));

  return (
    <div>
      <h2>Task History</h2>
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
