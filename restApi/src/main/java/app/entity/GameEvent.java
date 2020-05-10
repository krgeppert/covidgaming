package app.entity;

import app.dto.GameEventDto;

import javax.persistence.Entity;
import javax.persistence.OneToOne;

@Entity
public class GameEvent extends AbstractEntity {

    private String type;

    @OneToOne
    private Player creator;

    private String data;

    @Override
    public GameEventDto toDto() {
        GameEventDto dto = new GameEventDto();
        setRootDtoAttributes(dto);
        dto.setCreator(this.creator.toDto(true));
        dto.setType(this.type);
        dto.setData(this.data);
        return dto;
    }


    public Player getCreator() {
        return creator;
    }

    public void setCreator(Player creator) {
        this.creator = creator;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Object getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }
}
