import {GameJson} from "../../RestApi";

export interface GameEvent {
    id: number;
}

export abstract class GameModel {
    abstract readonly type: string;

    private gameJson: GameJson;

    constructor(gameJson: GameJson) {
        this.gameJson = gameJson;
    }

    async connectToGameUpdates()
}