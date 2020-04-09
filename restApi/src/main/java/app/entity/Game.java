package app.entity;


import app.dto.GameDto;

import javax.persistence.*;
import java.util.List;
import java.util.stream.Collectors;

@Entity
public class Game extends AbstractEntity {

    private boolean isFinished;
    private boolean isStarted;

    @OneToMany(cascade= CascadeType.DETACH)
    @Column(nullable=true)
    private List<Player> team1;


    @OneToMany(cascade= CascadeType.DETACH)
    @Column(nullable=true)
    private List<Player> team2;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @Column(nullable = true)
    private List<GameEvent> events;

    public List<Player> getTeam1() {
        return team1;
    }

    public void setTeam1(List<Player> team1) {
        this.team1 = team1;
    }

    public List<Player> getTeam2() {
        return team2;
    }

    public void setTeam2(List<Player> team2) {
        this.team2 = team2;
    }

    public boolean isFinished() {
        return isFinished;
    }

    public void setFinished(boolean finished) {
        isFinished = finished;
    }

    @Override
    public GameDto toDto() {
        GameDto dto= new GameDto();
        setRootDtoAttributes(dto);
        if (team1 != null){
            dto.setTeam1(team1.stream().map(Player::toDto).collect(Collectors.toList()));
        }

        if (team2 != null) {
            dto.setTeam2(team2.stream().map(Player::toDto).collect(Collectors.toList()));
        }
        return dto;
    }
}
