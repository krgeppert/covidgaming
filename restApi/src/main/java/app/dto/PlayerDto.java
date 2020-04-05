package app.dto;


public class PlayerDto extends EntityDto {

    private String name;
    private RoomDto room;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setRoomId(Long roomId) {
        this.id = roomId;
    }

    public RoomDto getRoom() {
        return room;
    }

    public void setRoom(RoomDto room) {
        this.room = room;
    }

}
