package app.entity;

import app.dto.GameEventDto;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToOne;

@Entity
public class GameEvent extends AbstractEntity {

    private String type;

    @OneToOne
    private Player creator;

    @Column(columnDefinition = "json")
    private String data;

    @Override
    public GameEventDto toDto() {
        GameEventDto dto = new GameEventDto();
        setRootDtoAttributes(dto);
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
