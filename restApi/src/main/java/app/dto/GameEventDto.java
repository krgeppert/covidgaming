package app.dto;



public class GameEventDto extends EntityDto {

    private String type;
    private PlayerDto creator;
    private String data;

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

    public Object getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }
}
