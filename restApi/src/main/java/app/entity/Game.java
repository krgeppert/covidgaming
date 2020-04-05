package app.entity;


import app.dto.EntityDto;

import javax.persistence.Entity;

@Entity
public class Game extends AbstractEntity {

    @Override
    public EntityDto toDto() {
        return null;
    }
}
