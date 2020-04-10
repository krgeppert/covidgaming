package app.dto;

import app.entity.Player;

import javax.persistence.OneToOne;

public class GameEventDto extends EntityDto {

    private String type;
    private PlayerDto creator;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public PlayerDto getCreator() {
        return creator;
    }

    public void setCreator(PlayerDto creator) {
        this.creator = creator;
    }
}
