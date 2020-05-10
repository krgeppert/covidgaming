import { GameEventJson } from "../../RestApi";

export class GameEvent {
    private readonly gameEventJson: GameEventJson;

    constructor(gameEventJson: GameEventJson) {
        this.gameEventJson = gameEventJson;
    }

    get id(): number {
        return this.gameEventJson.id;
    }

    getDate(): Date {
        return new Date(this.gameEventJson.createdDate);
    }
    getMessage(): string {
        return this.toString();
    }

    isSliderChangeEvent(): boolean {
        return this.gameEventJson.type === "slider-change";
    }

    getSliderPosition(): number {
        if (!this.isSliderChangeEvent()) {
            throw new Error("not slider change event");
        }
        const { position } = this.getData() as { position: number };
        return position;
    }

    private getData() {
        try {
            return JSON.parse(this.gameEventJson.data);
        } catch {
            return {};
        }
    }

    toString(): string {
        return `${this.gameEventJson.type} was done by ${
            this.gameEventJson.creator.name
        } at ${this.getDate().toLocaleTimeString()}`;
    }
}
