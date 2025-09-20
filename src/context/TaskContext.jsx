import React, { createContext, useState, useEffect } from "react";

export const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);

React.useEffect(() => {
  fetch("/tasks")
    .then((r) => r.json())
    .then((data) =>
      setTasks((prev) => (prev.length ? prev : data))
    );
}, []);


  async function addTask(title) {
    const temp = { id: Date.now(), title, completed: false };
    setTasks((xs) => [temp, ...xs]);

    try {
      const res = await fetch("/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, completed: false }),
      });
      const created = await res.json();
      setTasks((xs) =>
        xs.map((t) => (t.id === temp.id ? created : t))
      );
    } catch {
      setTasks((xs) => xs.filter((t) => t.id !== temp.id));
    }
  }

async function toggleComplete(id) {
  const toNum = (v) => (v == null ? NaN : Number(v));
  const keyMatch = (t) => toNum(t.id ?? t.taskId) === toNum(id);
  const current = tasks.find(keyMatch);
  if (!current) return;

  setTasks((xs) =>
    xs.map((t) => (keyMatch(t) ? { ...t, completed: !t.completed } : t))
  );

  try {
    const res = await fetch(`/tasks/${toNum(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !current.completed }),
    });
    const updated = await res.json();
    setTasks((xs) => xs.map((t) => (keyMatch(t) ? updated : t)));
  } catch {
    setTasks((xs) =>
      xs.map((t) => (keyMatch(t) ? { ...t, completed: current.completed } : t))
    );
  }
}

  return (
    <TaskContext.Provider value={{ tasks, addTask, toggleComplete }}>
      {children}
    </TaskContext.Provider>
  );
}
