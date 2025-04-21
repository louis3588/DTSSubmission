package cf.ac.uk.dtssubmission;

import cf.ac.uk.dtssubmission.model.Task;
import cf.ac.uk.dtssubmission.model.TaskStatus;
import cf.ac.uk.dtssubmission.service.TaskService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
@AutoConfigureMockMvc
class TaskControllerTest {

    @Mock
    private TaskService taskService;

    @InjectMocks
    private TaskController taskController;

    private final Task validTask = new Task(1L, "Valid Task", "Description",
            TaskStatus.PENDING, LocalDateTime.now().plusDays(1));
    private final Task invalidTask = new Task(null, null, "Description",
            TaskStatus.PENDING, null);

    @Test
    void createTask_WithValidTask_ReturnsCreated() {
        when(taskService.save(any(Task.class))).thenReturn(validTask);

        ResponseEntity<Task> response = taskController.createTask(validTask);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(validTask, response.getBody());
        verify(taskService, times(1)).save(validTask);
    }

    @Test
    void createTask_WithInvalidTask_ReturnsBadRequest() {
        ResponseEntity<Task> response = taskController.createTask(invalidTask);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verify(taskService, never()).save(any());
    }

    @Test
    void getAllTasks_ReturnsTasksList() {
        List<Task> tasks = Arrays.asList(validTask);
        when(taskService.findAll()).thenReturn(tasks);

        ResponseEntity<List<Task>> response = taskController.getAllTasks();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(tasks, response.getBody());
        verify(taskService, times(1)).findAll();
    }

    @Test
    void getTaskById_WithExistingId_ReturnsTask() {
        when(taskService.findById(1L)).thenReturn(Optional.of(validTask));

        ResponseEntity<Task> response = taskController.getTaskById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(validTask, response.getBody());
        verify(taskService, times(1)).findById(1L);
    }

    @Test
    void getTaskById_WithNonExistingId_ReturnsNotFound() {
        when(taskService.findById(999L)).thenReturn(Optional.empty());

        ResponseEntity<Task> response = taskController.getTaskById(999L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(taskService, times(1)).findById(999L);
    }

    @Test
    void updateTaskStatus_WithExistingTask_UpdatesStatus() {
        Task updatedTask = new Task(1L, "Valid Task", "Description",
                TaskStatus.IN_PROGRESS, LocalDateTime.now().plusDays(1));
        when(taskService.findById(1L)).thenReturn(Optional.of(validTask));
        when(taskService.save(any(Task.class))).thenReturn(updatedTask);

        ResponseEntity<Task> response = taskController.updateTaskStatus(1L, TaskStatus.IN_PROGRESS);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(TaskStatus.IN_PROGRESS, response.getBody().getStatus());
        verify(taskService, times(1)).findById(1L);
        verify(taskService, times(1)).save(validTask);
    }

    @Test
    void updateTaskStatus_WithNonExistingTask_ReturnsNotFound() {
        when(taskService.findById(999L)).thenReturn(Optional.empty());

        ResponseEntity<Task> response = taskController.updateTaskStatus(999L, TaskStatus.COMPLETED);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(taskService, never()).save(any());
    }

    @Test
    void deleteTask_WithExistingId_ReturnsNoContent() {
        when(taskService.existsById(1L)).thenReturn(true);

        ResponseEntity<Task> response = taskController.deleteTask(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(taskService, times(1)).deleteById(1L);
    }

    @Test
    void deleteTask_WithNonExistingId_ReturnsNotFound() {
        when(taskService.existsById(999L)).thenReturn(false);

        ResponseEntity<Task> response = taskController.deleteTask(999L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(taskService, never()).deleteById(any());
    }
}
