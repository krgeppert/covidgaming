package app.controller;

import app.entity.Game;
import app.repository.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping(path = "/game")
public class GameController {
    private final GameRepository gameRepository;

    @Autowired
    public GameController(GameRepository userRepository) {
        this.gameRepository = userRepository;
    }

    @RequestMapping(method = RequestMethod.POST)
    public Game create(@RequestBody Game game) {
        return gameRepository.save(game);
    }

    @RequestMapping(method = RequestMethod.GET)
    public Optional<Game> fetch(@RequestParam long id) {
        return gameRepository.findById(id);
    }

}
