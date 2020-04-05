package app.controller;

import app.dto.PlayerDto;
import app.dto.RoomDto;
import app.entity.Player;
import app.entity.Room;
import app.repository.PlayerRepository;
import app.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@RestController
@RequestMapping(path = "/player")
public class PlayerController {

    private final PlayerRepository playerRepository;
    private final RoomRepository roomRepository;

    @Autowired
    public PlayerController(PlayerRepository playerRepository, RoomRepository roomRepository) {
        this.playerRepository = playerRepository;
        this.roomRepository = roomRepository;
    }

    @RequestMapping(method = RequestMethod.POST)
    public PlayerDto create(@RequestBody PlayerDto playerDto) {
        Player player = new Player();
        player.setName(playerDto.getName());
        RoomDto roomDto = playerDto.getRoom();
        if (roomDto != null) {
            Optional<Room> room = roomRepository.findById(roomDto.getId());
            if (room.isPresent()) {
                this.putPlayerInRoom(player, room.get());

            } else {
                throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "room did not resolve to a known resource");
            }
        } else {
            playerRepository.save(player);
        }
        return player.toDto();

    }

    @RequestMapping(method = RequestMethod.GET, path = "/{playerId}")
    public PlayerDto fetch(@PathVariable long playerRepositoryById) {
        Optional<Player> player = playerRepository.findById(playerRepositoryById);
        if (player.isPresent()) {
            return player.get().toDto();
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }

    @RequestMapping(method = RequestMethod.POST, path = "/{playerId}/room")
    public PlayerDto joinRoom(@PathVariable long playerId, @RequestBody RoomDto roomDto) {
        Optional<Player> player = playerRepository.findById(playerId);
        Optional<Room> room = roomRepository.findById(roomDto.getId());
        if (player.isPresent() && room.isPresent()) {
            putPlayerInRoom(player.get(), room.get());
            return player.get().toDto();
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }

    private void putPlayerInRoom(Player player, Room room) {
        player.setRoom(room);
        playerRepository.save(player);

        if (room.getAdmin() == null){
            room.setAdmin(player);
            roomRepository.save(room);
        }
    }
}
