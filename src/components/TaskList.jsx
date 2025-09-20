import React, { useContext,useState } from "react";
import { TaskContext } from "../context/TaskContext";

function TaskList({query}) {
    const [tasks, setTasks] = useState([]);
    const { tasks: ctxTasks, toggleComplete } = useContext(TaskContext);

    const q = (query ?? "").toLowerCase();
    const filteredTasks = ctxTasks.filter((t) => {
      const title = (t.title ?? t.name ?? t.task ?? "");
      return title.toLowerCase().includes(q);
    });

  return (
    <ul>
      {filteredTasks.map((t, idx) => {
        const id = t.id ?? t.taskId;
        const title = t.title ?? t.name ?? t.task ?? "";
        const key = id ?? `task-${idx}`;

        return (
          <li key={key}>
            <span style={{ textDecoration: t.completed ? "line-through" : "none" }}>
              {title}
            </span>
            <button
              data-testid={String(id ?? idx)}
              onClick={() => id != null && toggleComplete(id)}
            >
              {t.completed ? "Undo" : "Mark Complete"}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default TaskList;
