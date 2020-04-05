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

    @OneToOne(cascade = CascadeType.DETACH)
    private Player admin;

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
        if (!shallow ){
            if (players != null) {
                List<PlayerDto> playerDtos = players.stream().map(player -> player.toDto(true)).collect(Collectors.toList());
                dto.setPlayers(playerDtos);
            }
            if (admin != null) {
                dto.setAdmin(admin.toDto(true));
            }
        }
        return dto;
    }

    public Player getAdmin() {
        return admin;
    }

    public void setAdmin(Player admin) {
        this.admin = admin;
    }
}
