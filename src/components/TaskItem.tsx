import React, { useState } from "react";

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

  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSaveEdit = () => {
    onEditTask(task.id, newTaskName);
    setIsEditing(false);
  };

  return (
    <li>
      {isReadOnly ? (
        <span>
          {task.name} - {formatTime(task.timeSpent)}
        </span>
      ) : (
        <>
          <input type="checkbox" checked={task.isActive} onChange={onToggle} />
          {isEditing ? (
            <span>
              <input
                type="text"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
              />
              <button onClick={handleSaveEdit}>Save</button>
            </span>
          ) : (
            <>
              <span>{task.name}</span>
              <button onClick={() => setIsEditing(true)}>Edit</button>
            </>
          )}

          {task.edited && <span> (Edited)</span>}
          {task.isActive && <span> (currently active)</span>}
          <span> - {formatTime(task.timeSpent)}</span>

          {Array.isArray(task.previousNames) &&
            task.previousNames.length > 0 && (
              <details>
                <summary>Previous Names</summary>
                <ul>
                  {task.previousNames.map((name, index) => (
                    <li key={index}>{name}</li>
                  ))}
                </ul>
              </details>
            )}
        </>
      )}
    </li>
  );
};

export default TaskItem;
