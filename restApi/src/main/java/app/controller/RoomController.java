package app.controller;

import app.dto.RoomDto;
import app.entity.Room;
import app.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@RestController
@RequestMapping(path = "/room")
public class RoomController {

    private final RoomRepository roomRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public RoomController(RoomRepository roomRepository, SimpMessagingTemplate messagingTemplate) {
        this.roomRepository = roomRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @RequestMapping(method = RequestMethod.POST)
    public RoomDto create(@RequestBody Room room) {
        roomRepository.save(room);
        return room.toDto();
    }

    @RequestMapping(method = RequestMethod.GET, path = "/{roomId}")
    public RoomDto fetch(@PathVariable long roomId) {
        Optional<Room> room = roomRepository.findById(roomId);
        if (room.isPresent()) {
            return room.get().toDto();
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "roomId did not resolve to an existing room");
        }
    }


}
