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
      <div className="flex flex-col items-start w-full">
        <div className="w-full text-gray-500 mb-2 text-lg font-semibold">
          {task.isActive ? (
            <span className="text-green-600 font-semibold">
              Currently active:
            </span>
          ) : (
            <span className=" font-semibold">Time spent:</span>
          )}{" "}
          {formatTime(elapsedTime)}
        </div>
        {isReadOnly ? (
          <div className="flex items-center justify-between w-full">
            <div className="text-gray-700">
              <span className="font-semibold">{task.name}</span>
              {task.edited && (
                <span className="text-yellow-600 ml-2 font-semibold">
                  (Edited)
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={task.isActive}
                onChange={onToggle}
                className="mr-2 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              {isEditing ? (
                <div className="flex items-center space-x-2 w-full">
                  <input
                    type="text"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    className="border rounded-lg px-2 py-1 text-gray-700 focus:outline-none focus:border-indigo-500 w-full"
                  />
                  <button
                    onClick={handleSaveEdit}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="font-semibold text-gray-700">
                    {task.name}
                  </span>
                  {task.edited && (
                    <span className="text-yellow-600 ml-2 font-semibold">
                      (Edited)
                    </span>
                  )}
                </div>
              )}
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition"
              >
                Edit
              </button>
            )}
          </div>
        )}
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
