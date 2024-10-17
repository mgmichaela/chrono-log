import React, { useState, useEffect } from "react";
import AddTaskForm from "./components/AddTaskForm";
import TaskList from "./components/TaskList";
import CalendarView from "./components/CalendarView";

interface Task {
  id: number;
  name: string;
  timeSpent: number;
  isActive: boolean;
  previousNames: string[];
  edited: boolean;
}

const ChronoLogApp: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const [currentDate, setCurrentDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [taskHistory, setTaskHistory] = useState<{ [key: string]: Task[] }>({});

  const todayDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const savedTaskHistory = localStorage.getItem("taskHistory");
    if (savedTaskHistory) {
      const parsedHistory = JSON.parse(savedTaskHistory);
      setTaskHistory(parsedHistory);

      if (parsedHistory[currentDate]) {
        const updatedTasks = parsedHistory[currentDate].map((task: Task) => ({
          ...task,
          isActive: false,
        }));
        setTasks(updatedTasks);
      }
    }
  }, [currentDate]);

  useEffect(() => {
    if (tasks.length > 0) {
      setTaskHistory((prevHistory) => ({
        ...prevHistory,
        [currentDate]: tasks,
      }));
    }
  }, [tasks, currentDate]);

  useEffect(() => {
    if (Object.keys(taskHistory).length > 0) {
      localStorage.setItem("taskHistory", JSON.stringify(taskHistory));
    }
  }, [taskHistory]);

  const addTask = (name: string) => {
    setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        name,
        timeSpent: 0,
        isActive: false,
        previousNames: [],
        edited: false,
      },
    ]);
  };

  const toggleTask = (taskId: number) => {
    if (activeTaskId === taskId) {
      clearInterval(timerId!);
      setTimerId(null);
      setActiveTaskId(null);

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, isActive: false } : task
        )
      );
    } else {
      if (activeTaskId !== null) {
        clearInterval(timerId!);
        setTasks((prev) =>
          prev.map((task) =>
            task.id === activeTaskId ? { ...task, isActive: false } : task
          )
        );
      }

      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, isActive: true } : task
        )
      );
      setActiveTaskId(taskId);

      const newTimerId = setInterval(() => {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId
              ? { ...task, timeSpent: task.timeSpent + 1 }
              : task
          )
        );
      }, 1000);

      setTimerId(newTimerId);
    }
  };

  const editTask = (taskId: number, newName: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        const trimmedNewName = newName.trim();
        if (task.id === taskId && trimmedNewName !== task.name.trim()) {
          return {
            ...task,
            name: trimmedNewName,
            edited: true,
            previousNames: [...task.previousNames, task.name],
          };
        }
        return task;
      })
    );
  };

  const handleDateChange = (date: string) => {
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
    setActiveTaskId(null);

    setCurrentDate(date);
  };

  return (
    <div>
      <h1>ChronoLog</h1>
      <CalendarView taskHistory={taskHistory} onDateSelect={handleDateChange} />
      <h2>Tasks for {currentDate}</h2>
      <AddTaskForm onAddTask={addTask} />
      <TaskList
        tasks={tasks}
        onToggleTask={toggleTask}
        onEditTask={editTask}
        isReadOnly={currentDate !== todayDate}
      />
    </div>
  );
};

export default ChronoLogApp;
