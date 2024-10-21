import React, { useState } from "react";

interface AddTaskFormProps {
  onAddTask: (taskName: string) => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask }) => {
  const [taskName, setTaskName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskName.trim()) {
      onAddTask(taskName);
      setTaskName("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <input
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="New Task"
        className="border p-2 rounded"
      />
      <button
        type="submit"
        className="bg-gray-700 text-white p-2 rounded hover:bg-gray-800"
      >
        Add Task
      </button>
    </form>
  );
};

export default AddTaskForm;
