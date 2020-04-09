package app.controller;

import app.dto.GameDto;
import app.dto.GameEventDto;
import app.entity.Game;
import app.entity.Room;
import app.repository.GameRepository;
import app.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@RestController
@RequestMapping(path = "/room/{roomId}/game")
public class GameController {

    private final RoomRepository roomRepository;
    private final GameRepository gameRepository;
    private final SimpMessagingTemplate messagingTemplate;


    @Autowired
    public GameController(RoomRepository roomRepository, GameRepository userRepository, SimpMessagingTemplate messagingTemplate) {
        this.roomRepository = roomRepository;
        this.gameRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @RequestMapping(method = RequestMethod.POST)
    public GameDto create(@RequestBody Game game, @PathVariable long roomId) {
        Optional<Room> optionalRoom = roomRepository.findById(roomId);
        if (optionalRoom.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found");
        }
        Room room = optionalRoom.get();
        Game existingGame = room.getGame();
        if (existingGame != null && !existingGame.isFinished()) {
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Room has an unfinished game.");
        }
        gameRepository.save(game);
        room.setGame(game);
        roomRepository.save(room);
        messagingTemplate.convertAndSend("/topic/room/" + roomId, room.toDto());
        return game.toDto();
    }

    @RequestMapping(method = RequestMethod.GET, path = "/{gameId}")
    public GameDto fetch(@PathVariable long gameId) {
        return this.retrieveGameOrThrow(gameId).toDto();
    }


    private Game retrieveGameOrThrow(long gameId) {
        Optional<Game> optionalGame = gameRepository.findById(gameId);
        if (optionalGame.isPresent()) {
            return optionalGame.get();
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "gameId does not resolve to a Game");
        }
    }
}
