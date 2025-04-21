package cf.ac.uk.dtssubmission.repo;

import cf.ac.uk.dtssubmission.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepo extends JpaRepository<Task, Long> {
}
