package app.repository;

import app.entity.GameEvent;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameEventRepository extends CrudRepository<GameEvent, Long> {

    GameEvent save(GameEvent gameEvent);
}
