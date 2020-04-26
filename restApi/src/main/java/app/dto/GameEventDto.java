package app.dto;



// Out of sync with game event cuz im lazy.
public class GameEventDto extends EntityDto {

    private String type;
    private PlayerDto creator;
    private Object data;

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

    public void setData(Object data) {
        this.data = data;
    }
}
