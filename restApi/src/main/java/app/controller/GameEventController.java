package app.controller;

import app.dto.GameEventDto;
import app.entity.Game;
import app.entity.GameEvent;
import app.repository.GameEventRepository;
import app.repository.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Controller
public class GameEventController {

    private final GameRepository gameRepository;
    private final GameEventRepository gameEventRepository;

    @Autowired
    public GameEventController(GameRepository gameRepository, GameEventRepository gameEventRepository) {
        this.gameRepository = gameRepository;
        this.gameEventRepository = gameEventRepository;
    }

    @MessageMapping("/game/{gameId}/event")
    @Transactional
    public GameEventDto createGameEvent(@Payload GameEvent gameEvent, @DestinationVariable long gameId) {
        Optional<Game> optionalGame = gameRepository.findById(gameId);
        if (optionalGame.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Game not found");
        }
        Game game = optionalGame.get();
        if (game.isFinished()) {
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Game is finished");
        }
        if (gameEvent.getData() == null) {
            gameEvent.setData("");
        }
        gameEventRepository.save(gameEvent);
        List<GameEvent> events = game.getEvents();
        events.add(gameEvent);
        game.setEvents(events);
        gameRepository.save(game);

        return gameEvent.toDto();
    }

}
