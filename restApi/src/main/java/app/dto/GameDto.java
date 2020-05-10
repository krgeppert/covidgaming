package app.dto;

import java.util.List;

public class GameDto extends EntityDto {
    private List<PlayerDto> participants;
    private List<PlayerDto> team1;
    private List<PlayerDto> team2;
    private List<GameEventDto> events;


    public List<PlayerDto> getTeam1() {
        return team1;
    }

    public void setTeam1(List<PlayerDto> team1) {
        this.team1 = team1;
    }

    public List<PlayerDto> getTeam2() {
        return team2;
    }

    public void setTeam2(List<PlayerDto> team2) {
        this.team2 = team2;
    }

    public List<PlayerDto> getParticipants() {
        return participants;
    }

    public void setParticipants(List<PlayerDto> participants) {
        this.participants = participants;
    }

    public List<GameEventDto> getEvents() {
        return events;
    }

    public void setEvents(List<GameEventDto> events) {
        this.events = events;
    }
}
