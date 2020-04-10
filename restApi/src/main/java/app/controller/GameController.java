package app.controller;

import app.dto.GameDto;
import app.entity.Game;
import app.entity.Player;
import app.entity.Room;
import app.repository.GameRepository;
import app.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
        game.setParticipants(room.getPlayers().stream().map(a -> a).collect(Collectors.toList()));
        gameRepository.save(game);
        room.setGame(game);
        roomRepository.save(room);
        messagingTemplate.convertAndSend("/topic/room/" + roomId, room.toDto());
        return game.toDto();
    }

    @RequestMapping(method = RequestMethod.PUT, path = "/{gameId}/team/{teamId}")
    public GameDto update(@RequestBody List<Player> players, @PathVariable long roomId, @PathVariable long gameId, @PathVariable long teamId) {
        Optional<Room> optionalRoom = roomRepository.findById(roomId);
        Optional<Game> optionalGame = gameRepository.findById(gameId);
        if (optionalRoom.isEmpty() || optionalGame.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Room or Game not found");
        }
        Room room = optionalRoom.get();
        Game game = optionalGame.get();
        if (room.getGame().getId() != game.getId()) {
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Wtf u doing");
        }
        if (teamId == 1) {
            game.setTeam1(players);
        } else if (
                teamId == 2
        ) {
            game.setTeam2(players);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Wtf u doing");
        }

        gameRepository.save(game);
        messagingTemplate.convertAndSend("/topic/game/" + game.getId(), game.toDto());
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
