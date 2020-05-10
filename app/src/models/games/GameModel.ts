import { GameJson, PlayerJson, RestApi } from "../../RestApi";
import { webSocketApiInstance } from "../../WebSocketApi";
import { GameEvent } from "./GameEvent";

export class GameModel {
    gameJson: GameJson;
    private _gameEvents: GameEvent[];
    private roomId: number;
    private player: PlayerJson;

    constructor(gameJson: GameJson, roomId: number, player: PlayerJson) {
        this.player = player;
        this.roomId = roomId;
        this.gameJson = gameJson;
        this._gameEvents =
            gameJson.events?.map(
                (gameEventJson) => new GameEvent(gameEventJson)
            ) || [];
    }

    get gameEvents(): GameEvent[] {
        return this._gameEvents;
    }

    get participants(): PlayerJson[] {
        return this.gameJson.participants;
    }

    async connectToGameUpdates(render: () => void): Promise<() => void> {
        const gameSubscription = await webSocketApiInstance.subscribeToGameUpdates(
            this.gameJson.id,
            (gameJson) => {
                this.gameJson = gameJson;
                render();
            }
        );
        const eventSubscription = await webSocketApiInstance.subscribeToGameEvents(
            this.gameJson.id,
            (gameEventJson) => {
                this._gameEvents.push(new GameEvent(gameEventJson));
                render();
            }
        );
        return () => {
            gameSubscription.unsubscribe();
            eventSubscription.unsubscribe();
        };
    }

    getLatestEvent(): GameEvent | undefined {
        const sorted = this.getEventsSortedByDate();
        return sorted[sorted.length - 1];
    }

    getFirstEvent(): GameEvent | undefined {
        const sorted = this.getEventsSortedByDate();
        return sorted[0];
    }

    getEventsSortedByDate(reverse: boolean = false) {
        return this.gameEvents.concat().sort((first, second) => {
            return (
                (first.getDate().getTime() - second.getDate().getTime()) *
                (reverse ? -1 : 1)
            );
        });
    }

    isStarted() {
        return !!this.getFirstEvent();
    }

    async toggleTeam(participant: PlayerJson, teamNumber: 1 | 2) {
        const teamKey = (("team" + teamNumber) as "team1") || "team2";
        let team = this.gameJson[teamKey] || [];

        const existing = team.find((a) => a.id === participant.id);
        if (existing) {
            team = team.filter((a) => a !== existing);
        } else {
            team.push(participant);
        }

        await RestApi.updateTeam(
            this.roomId,
            this.gameJson.id,
            teamNumber,
            team
        );
    }

    playerIsOnTeam(participant: PlayerJson) {
        return !!(this.gameJson.team1 || [])
            .concat(this.gameJson.team2 || [])
            .find((onTeam) => onTeam.id === participant.id);
    }

    async randomizeTeams() {
        const assignments: Map<PlayerJson, number> = new Map();
        this.participants.forEach((participant) => {
            assignments.set(participant, Math.random());
        });
        const sorted = this.participants.sort((a, b) => {
            return assignments.get(a)! - assignments.get(b)!;
        });
        const middleIndex = Math.round(sorted.length / 2);
        await RestApi.updateTeam(
            this.roomId,
            this.gameJson.id,
            1,
            sorted.slice(0, middleIndex)
        );
        await RestApi.updateTeam(
            this.roomId,
            this.gameJson.id,
            2,
            sorted.slice(middleIndex, sorted.length)
        );
    }

    start() {
        this.sendGameEvent("start");
    }

    private sendGameEvent(type: string, data?: object) {
        // @ts-ignore go fuck urself
        webSocketApiInstance.sendGameEvent(this.gameJson.id, {
            creator: this.player,
            type,
            data: JSON.stringify(data)
        });
    }

    playerIsClueGiver() {
        return true; // todo
    }

    getGuessZones() {
        return [
            // todo
            { start: 0.1, value: 1, end: 0.2 },
            { start: 0.2, value: 2, end: 0.3 },
            { start: 0.3, value: 3, end: 0.4 },
            { start: 0.4, value: 2, end: 0.5 },
            { start: 0.5, value: 1, end: 0.6 }
        ];
    }

    getSliderPosition() {
        return (
            this.getEventsSortedByDate(true)
                .find((gameEvent) => gameEvent.isSliderChangeEvent())
                ?.getSliderPosition() || 0.5
        );
    }

    changeSliderPosition(position: number) {
        this.sendGameEvent("slider-change", { position });
    }
}
