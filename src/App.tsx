import React, { useState, useEffect } from "react";
import AddTaskForm from "./components/AddTaskForm";
import TaskList from "./components/TaskList";
import CalendarView from "./components/CalendarView";
import "./index.css";
import logo from "./components/images/logo.png";
import moment from "moment";

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
    <div className="min-h-screen flex">
      <div className="bg-gray-800 text-white w-64">
        <div className="p-8">
          <h2 className="text-2xl font-bold mt-1">History</h2>
        </div>
        <div className="p-8">
          <CalendarView
            taskHistory={taskHistory}
            onDateSelect={handleDateChange}
          />
        </div>
      </div>
      <div className="flex-1 bg-gray-100 p-8">
        <div className="flex items-center mb-1">
          <h1 className="text-4xl font-bold text-gray-700 mr-3">ChronoLog</h1>
          <img src={logo} alt="ChronoLog Logo" style={{ width: "2.5rem" }} />
        </div>

        <h2 className="text-2xl text-gray-700 mb-1">
          Your Personal Time Management Assistant
        </h2>

        <div className="bg-white shadow-md rounded-lg p-6 mt-7">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            {/* Tasks for {moment().calendar(currentDate)} */}
            Tasks for{" "}
            {moment(currentDate).calendar(null, {
              sameDay: "[today]",
              lastDay: "[yesterday]",
              lastWeek: "[last] dddd",
              sameElse: "MMMM Do, YYYY",
            })}
          </h2>
          {currentDate === todayDate && <AddTaskForm onAddTask={addTask} />}
          <TaskList
            tasks={tasks}
            onToggleTask={toggleTask}
            onEditTask={editTask}
            isReadOnly={currentDate !== todayDate}
          />
        </div>
      </div>
    </div>
  );
};

export default ChronoLogApp;
