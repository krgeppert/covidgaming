package app.entity;

import app.dto.PlayerDto;
import app.dto.RoomDto;

import javax.persistence.*;
import java.util.List;
import java.util.stream.Collectors;

@Entity
public class Room extends AbstractEntity {
    @Column(nullable = false)
    private String name;

    @OneToMany(cascade= CascadeType.DETACH, mappedBy = "room")
    private List<Player> players;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Player> getPlayers() {
        return players;
    }

    public void setPlayers(List<Player> players) {
        this.players = players;
    }

    public RoomDto toDto() {
        return toDto(false);
    }

    public RoomDto toDto(boolean shallow) {
        RoomDto dto =  new RoomDto();
        this.setRootDtoAttributes(dto);
        dto.setName(name);
        if (!shallow && players != null){
            List<PlayerDto> playerDtos = players.stream().map(player -> player.toDto(true)).collect(Collectors.toList());
            dto.setPlayers(playerDtos);
        }
        return dto;
    }
}
