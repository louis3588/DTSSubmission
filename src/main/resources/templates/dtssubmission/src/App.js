
import './App.css';

import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Typography, TextField, Modal, Box, Select, MenuItem, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import 'bootstrap/dist/css/bootstrap.min.css';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
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
        setOpen(false);
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
          <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
            Add New Task
          </Button>
        </div>

        <Modal open={open} onClose={() => setOpen(false)}>
          <Box sx={style}>
            <form onSubmit={handleCreateTask}>
              <TextField
                  fullWidth
                  label="Title"
                  variant="outlined"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                  className="mb-3"
              />
              <TextField
                  fullWidth
                  label="Description"
                  variant="outlined"
                  multiline
                  rows={3}
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="mb-3"
              />
              <TextField
                  fullWidth
                  type="datetime-local"
                  label="Due Date & Time"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  value={newTask.dueDateTime}
                  onChange={(e) => setNewTask({ ...newTask, dueDateTime: e.target.value })}
                  required
                  className="mb-3"
              />
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Create Task
              </Button>
            </form>
          </Box>
        </Modal>

        <div className="row">
          {tasks.map((task) => (
              <div className="col-md-4 mb-4" key={task.id}>
                <Card
                    className={`shadow-sm ${selectedTask === task.id ? 'border-primary' : ''}`}
                    onClick={() => setSelectedTask(task.id)}
                    style={{ cursor: 'pointer' }}
                >
                  <CardContent>
                    <div className="d-flex justify-content-between align-items-start">
                      <Typography variant="h5" component="div">
                        {task.title}
                      </Typography>
                      {selectedTask === task.id && (
                          <IconButton
                              aria-label="delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTask(task.id);
                              }}
                              color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                      )}
                    </div>

                    <Typography variant="body2" color="text.secondary" className="my-2">
                      {task.description}
                    </Typography>

                    <Typography variant="caption" display="block" gutterBottom>
                      Due: {new Date(task.dueDateTime).toLocaleString()}
                    </Typography>

                    <Select
                        fullWidth
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        variant="outlined"
                        size="small"
                        className="mt-2"
                    >
                      <MenuItem value="PENDING">Pending</MenuItem>
                      <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                      <MenuItem value="COMPLETED">Completed</MenuItem>
                    </Select>
                  </CardContent>
                </Card>
              </div>
          ))}
        </div>
      </div>
  );
}

export default App;