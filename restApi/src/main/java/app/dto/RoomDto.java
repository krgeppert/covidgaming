package app.dto;

import java.util.List;

public class RoomDto extends EntityDto {

    private String name;
    private List<PlayerDto> players;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<PlayerDto> getPlayers() {
        return players;
    }

    public void setPlayers(List<PlayerDto> players) {
        this.players = players;
    }
}
