
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
  const [dateError, setDateError] = useState('');

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
    const selectedDate = new Date(newTask.dueDateTime);
    const now = new Date();

    if (selectedDate <= now) {
      setDateError('Please enter a due date that is in the future');
      return;
    }

    setDateError('');
    try {
      const response = await fetch('http://localhost:8080/api/tasks', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newTask)
      });
      if (response.ok) {
        setShowModal(false);
        setNewTask({title: '', description: '', dueDateTime: '', status: 'PENDING'});
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
        headers: {'Content-Type': 'application/json'},
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
      <div className="container-lg mt-4 px-4" style={{ maxWidth: '1200px' }}>
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h1 className="fw-bold text-dark mb-0">My Tasks</h1>
          <button
              className="btn btn-dark py-2 px-4 fw-bold rounded-3"
              style={{ fontSize: '1.1rem' }}
              onClick={() => {
                  setShowModal(true);
                  setDateError("")}}
          >
            + Add New Task
          </button>
        </div>

        {/* Overlay Form */}
        {showModal && (
            <div className="overlay">
              <div className="form-container">
                <div className="form-header">
                  <h2 className="text-dark mb-4">Create New Task</h2>
                  <button
                      className="close-btn"
                      onClick={() => setShowModal(false)}
                  >
                    ×
                  </button>
                </div>
                <form onSubmit={handleCreateTask}>
                  <div className="mb-4">
                    <label className="form-label text-dark">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label text-dark">Description</label>
                    <textarea
                        className="form-control"
                        rows="3"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label className="form-label text-dark">Due Date & Time</label>
                    <input
                        type="datetime-local"
                        className="form-control"
                        value={newTask.dueDateTime}
                        onChange={(e) => setNewTask({ ...newTask, dueDateTime: e.target.value })}
                        required
                    />
                    {dateError && <div className="text-danger mt-2">{dateError}</div>}
                  </div>
                  <button
                      type="submit"
                      className="btn btn-dark w-100 py-2 fw-bold"
                  >
                    Create Task
                  </button>
                </form>
              </div>
            </div>
        )}

        {tasks.length === 0 ? (
            <div className="text-center mt-5 pt-5">
              <h3 className="text-secondary">No tasks yet</h3>
              <p className="text-muted">Click the button above to add your first task</p>
            </div>
        ) : (
            <div className="row g-4">
              {tasks.map((task) => (
                  <div className="col-md-6 col-lg-4" key={task.id}>
                    <div
                        className={`card h-100 shadow-sm task-card ${selectedTask === task.id ? 'selected' : ''}`}
                        onClick={() => setSelectedTask(task.id)}
                    >
                      <div className="card-body d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <h3 className="card-title fw-bold mb-0 text-dark">{task.title}</h3>
                          {selectedTask === task.id && (
                              <button
                                  className="btn btn-danger btn-sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteTask(task.id);
                                  }}
                              >
                                Delete
                              </button>
                          )}
                        </div>

                        {task.description && (
                            <p className="card-text text-muted mb-3 flex-grow-1">{task.description}</p>
                        )}

                        <div className="mt-auto">
                          <p className="text-dark small mb-2">
                            <span className="fw-medium">Due:</span> {new Date(task.dueDateTime).toLocaleString()}
                          </p>

                          <select
                              className="form-select"
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
                  </div>
              ))}
            </div>
        )}
      </div>
  );
}

export default App;