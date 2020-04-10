package app.entity;


import app.dto.GameDto;

import javax.persistence.*;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Entity
public class Game extends AbstractEntity {


    @OneToMany
    @Column(nullable = false, updatable = false)
    private List<Player> participants;

    @OneToMany(cascade= CascadeType.DETACH)
    private List<Player> team1;


    @OneToMany(cascade= CascadeType.DETACH)
    private List<Player> team2;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
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

    public List<Player> getParticipants() {
        return participants;
    }

    public void setParticipants(List<Player> participants) {
        this.participants = participants;
    }

    public List<GameEvent> getEvents() {
        return events;
    }

    public void setEvents(List<GameEvent> events) {
        this.events = events;
    }

    @Override
    public GameDto toDto() {
        GameDto dto= new GameDto();
        setRootDtoAttributes(dto);
        dto.setParticipants(participants.stream().map(player -> player.toDto(true)).collect(Collectors.toList()));
        if (team1 != null){
            dto.setTeam1(team1.stream().map(player -> player.toDto(true)).collect(Collectors.toList()));
        }

        if (team2 != null) {
            dto.setTeam2(team2.stream().map(player -> player.toDto(true)).collect(Collectors.toList()));
        }
        return dto;
    }

    public boolean isFinished() {
        events.sort(Comparator.comparing(AbstractEntity::getCreatedDate));
        GameEvent lastEvent = events.get(events.size() - 1);
        return lastEvent != null && lastEvent.getType() == "finish";

    }
}
