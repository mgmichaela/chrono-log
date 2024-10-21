import React, { useState, useEffect, useRef } from "react";

interface Task {
  id: number;
  name: string;
  timeSpent: number;
  isActive: boolean;
  previousNames: string[];
  edited: boolean;
}

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onEditTask: (taskId: number, newName: string) => void;
  isReadOnly: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onEditTask,
  isReadOnly,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTaskName, setNewTaskName] = useState(task.name);
  const [elapsedTime, setElapsedTime] = useState(task.timeSpent);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (task.isActive) {
      startTimeRef.current = Date.now() - elapsedTime * 1000;

      intervalRef.current = setInterval(() => {
        if (startTimeRef.current !== null) {
          const currentTime = Date.now();
          setElapsedTime(
            Math.floor((currentTime - startTimeRef.current) / 1000)
          );
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [task.isActive]);

  const handleSaveEdit = () => {
    onEditTask(task.id, newTaskName);
    setIsEditing(false);
  };

  return (
    <li className="flex flex-col p-4 bg-white shadow-md rounded-lg mb-3 transition-all hover:shadow-lg">
      <div className="flex items-center justify-between">
        {isReadOnly ? (
          <div className="text-gray-700">
            <span className="font-semibold">{task.name}</span>
            <span className="text-gray-500 ml-2">
              {formatTime(elapsedTime)}
            </span>
          </div>
        ) : (
          <>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={task.isActive}
                onChange={onToggle}
                className="mr-2 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    className="border rounded-lg px-2 py-1 text-gray-700 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={handleSaveEdit}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-700">
                    {task.name}
                  </span>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          </>
        )}
        <div className="text-right">
          {task.edited && (
            <span className="text-yellow-600 font-semibold">(Edited)</span>
          )}
          {task.isActive && (
            <span className="text-green-600 font-semibold">
              Currently Active
            </span>
          )}
          <span className="block text-gray-500 mt-1">
            {formatTime(elapsedTime)}
          </span>
        </div>
      </div>
      {Array.isArray(task.previousNames) && task.previousNames.length > 0 && (
        <details className="mt-4">
          <summary className="text-gray-600 cursor-pointer hover:text-gray-800">
            Previous Names
          </summary>
          <ul className="ml-4 mt-2 list-disc list-inside text-gray-600">
            {task.previousNames.map((name, index) => (
              <li key={index}>{name}</li>
            ))}
          </ul>
        </details>
      )}
    </li>
  );
};

export default TaskItem;
