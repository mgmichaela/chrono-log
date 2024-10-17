import TaskItem from "./TaskItem";

interface Task {
  id: number;
  name: string;
  timeSpent: number;
  isActive: boolean;
  previousNames: string[];
  edited: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (taskId: number) => void;
  onEditTask: (taskId: number, newName: string) => void;
  isReadOnly: boolean;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleTask,
  onEditTask,
  isReadOnly,
}) => {
  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={() => onToggleTask(task.id)}
          onEditTask={onEditTask}
          isReadOnly={isReadOnly}
        />
      ))}
    </ul>
  );
};

export default TaskList;
