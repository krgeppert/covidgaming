import {PlayerJson, Room} from "../../RestApi";

export class Player {
    readonly id: string;
    readonly name: string;

    constructor(playerJson: PlayerJson) {
        this.id =  playerJson.id;
        this.name =  playerJson.name;
    }

    isAdminOf(room: Room) {
        return room.admin?.id === this.id;
    }
}