package app.controller;

import app.dto.GameEventDto;
import app.entity.GameEvent;
import app.repository.GameEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

@Controller
public class GameEventController {

    private final GameEventRepository gameEventRepository;

    @Autowired
    public GameEventController(GameEventRepository gameEventRepository) {
        this.gameEventRepository = gameEventRepository;
    }

    @MessageMapping("/topic/game/{gameId}/new-events")
    public GameEventDto createGameEvent(@Payload GameEvent gameEvent){
        gameEventRepository.save(gameEvent);
        return gameEvent.toDto();
    }

}
