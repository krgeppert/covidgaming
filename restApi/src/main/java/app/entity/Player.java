package app.entity;

import app.dto.PlayerDto;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
public class Player extends AbstractEntity {
    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "ROOM_ID", nullable = true)
    private Room room;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public PlayerDto toDto() {
        return toDto(false);
    }

    public PlayerDto toDto(boolean shallow) {
        PlayerDto dto = new PlayerDto();
        this.setRootDtoAttributes(dto);

        dto.setName(name);
        if (room != null && !shallow) {
            dto.setRoom(room.toDto(true));
        }
        return dto;
    }


}
