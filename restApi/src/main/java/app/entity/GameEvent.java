package app.entity;

import app.dto.GameEventDto;

import javax.persistence.Entity;

@Entity
public class GameEvent extends AbstractEntity {

    @Override
    public GameEventDto toDto() {
        GameEventDto dto = new GameEventDto();
        setRootDtoAttributes(dto);
        return dto;
    }
}
