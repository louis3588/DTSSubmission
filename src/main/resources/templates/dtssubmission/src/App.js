
import './App.css';

import React, { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDateTime: '',
    status: 'PENDING'
  });
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      if (response.ok) {
        setShowModal(false);
        setNewTask({ title: '', description: '', dueDateTime: '', status: 'PENDING' });
        await fetchTasks();
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/tasks/${taskId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStatus)
      });
      if (response.ok) {
        await fetchTasks();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await fetchTasks();
        setSelectedTask(null);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Task Management System</h1>
          <button
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
          >
            Add New Task
          </button>
        </div>

        {/* Modal */}
        <div className={`modal ${showModal ? 'd-block' : 'd-none'}`} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Task</h5>
                <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleCreateTask}>
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        rows="3"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Due Date & Time</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        value={newTask.dueDateTime}
                        onChange={(e) => setNewTask({ ...newTask, dueDateTime: e.target.value })}
                        required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Create Task
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {tasks.map((task) => (
              <div className="col-md-4 mb-4" key={task.id}>
                <div
                    className={`card shadow-sm ${selectedTask === task.id ? 'border-primary' : ''}`}
                    onClick={() => setSelectedTask(task.id)}
                    style={{ cursor: 'pointer' }}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <h5 className="card-title">{task.title}</h5>
                      {selectedTask === task.id && (
                          <button
                              className="btn btn-danger btn-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTask(task.id);
                              }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                            </svg>
                          </button>
                      )}
                    </div>

                    {task.description && (
                        <p className="card-text text-muted my-2">{task.description}</p>
                    )}

                    <p className="card-text text-muted small mb-2">
                      Due: {new Date(task.dueDateTime).toLocaleString()}
                    </p>

                    <select
                        className="form-select form-select-sm mt-2"
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
          ))}
        </div>
      </div>
  );
}

export default App;