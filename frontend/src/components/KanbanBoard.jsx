// HOW IT WORKS:
// This component displays tasks in a Kanban board format with columns for Todo, In Progress, and Done
// It allows dragging and dropping tasks between columns to update their status

import React from 'react';
import { useTasks } from '../hooks/useTasks';

const KanbanBoard = ({ projectId }) => {
  const { tasks, loading, error, updateTask } = useTasks(projectId);

  const updateTaskStatus = async (taskId, status) => {
    try {
      await updateTask(taskId, { status });
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  const getColumnTasks = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    await updateTaskStatus(taskId, status);
  };

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div>Error loading tasks: {error}</div>;

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-gray-200' },
    { id: 'inprogress', title: 'In Progress', color: 'bg-blue-200' },
    { id: 'done', title: 'Done', color: 'bg-green-200' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      {columns.map(column => (
        <div 
          key={column.id}
          className="rounded-lg border border-gray-200"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <div className={`${column.color} p-3 rounded-t-lg`}>
            <h3 className="font-semibold">{column.title}</h3>
          </div>
          <div className="p-3 min-h-[200px]">
            {getColumnTasks(column.id).map(task => (
              <div 
                key={task._id}
                draggable
                onDragStart={(e) => handleDragStart(e, task._id)}
                className="card p-3 mb-3 cursor-move hover:shadow-md transition-shadow"
              >
                <h4 className="font-medium">{task.title}</h4>
                {task.description && (
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                )}
                {task.assignedTo && (
                  <div className="mt-2 text-xs text-gray-500">
                    Assigned to: {task.assignedTo.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;