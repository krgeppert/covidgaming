import { Client, IFrame } from "@stomp/stompjs";
import { StompSubscription } from "@stomp/stompjs/esm5/stomp-subscription";
import { GameEventJson, GameJson, Room } from "./RestApi";
import { GameEvent } from "./models/games/GameEvent";

export class WebSocketApi {
    private readonly rootUrl = new URL("ws://localhost:8000/websocket");
    private readonly client = new Client({
        webSocketFactory: () => {
            return new WebSocket(this.rootUrl.toString());
        }
    });

    private promiseToConnect?: Promise<IFrame>;
    private connected: boolean = false;

    async connect(): Promise<IFrame> {
        if (this.promiseToConnect) return this.promiseToConnect;
        this.promiseToConnect = new Promise((resolve, reject) => {
            this.client.onConnect = (frame: IFrame) => {
                this.connected = true;
                resolve(frame);
            };
            this.client.activate();
        });
        return this.promiseToConnect;
    }

    async subscribeToRoomUpdates(
        roomId: number,
        callback: (room: Room) => void
    ): Promise<StompSubscription> {
        await this.connect();
        return this.client.subscribe(`/topic/room/${roomId}`, (message) => {
            callback(JSON.parse(message.body));
        });
    }

    async subscribeToGameUpdates(
        gameId: number,
        callback: (game: GameJson) => void
    ) {
        await this.connect();
        return this.client.subscribe(`/topic/game/${gameId}`, (message) => {
            callback(JSON.parse(message.body));
        });
    }

    async subscribeToGameEvents(
        gameId: number,
        callback: (game: GameEventJson) => void
    ) {
        await this.connect();
        return this.client.subscribe(
            `/topic/game/${gameId}/event`,
            (message) => {
                callback(JSON.parse(message.body));
            }
        );
    }

    sendGameEvent(gameId: number, gameEvent: GameEventJson) {
        this.client.publish({
            destination: `/app/game/${gameId}/event`,
            body: JSON.stringify(gameEvent)
        });
    }
}

export const webSocketApiInstance = new WebSocketApi();
