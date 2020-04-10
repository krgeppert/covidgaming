import { GameEventJson } from "../../RestApi";

export class GameEvent {
    private readonly gameEventJson: GameEventJson;

    constructor(gameEventJson: GameEventJson) {
        this.gameEventJson = gameEventJson;
    }

    getDate(): Date {
        return new Date(this.gameEventJson.createdDate);
    }
    getMessage(): string {
        return this.toString();
    }

    toString(): string {
        return `${this.gameEventJson.type} was done by ${
            this.gameEventJson.creator.name
        } at ${this.getDate().toLocaleTimeString()}`;
    }

    toJson(): GameEventJson {
        return this.gameEventJson;
    }
}
