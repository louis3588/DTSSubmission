package cf.ac.uk.dtssubmission.service;

import cf.ac.uk.dtssubmission.model.Task;
import cf.ac.uk.dtssubmission.repo.TaskRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/*
    Service layer in order to implement proper seperations of concerns principles
 */
@Service
public class TaskService {

    @Autowired
    private TaskRepo repository;

    public Task save(Task task) {
        return repository.save(task);
    }

    public List<Task> findAll() {
        return repository.findAll();
    }

    public Optional<Task> findById(Long id) {
        return repository.findById(id);
    }

    public boolean existsById(Long id) {
        return repository.existsById(id);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
