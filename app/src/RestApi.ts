import {Player} from "./components/models/Player";

export interface Room {
    id: number;
    name: string;
    players: PlayerJson[];
    gameId?: string;
    admin?: PlayerJson;
} 

export interface PlayerJson {
    name: string;
    id: string;
}

export class RestApi {
    static readonly rootUrl = new URL(
        "http://localhost:8080/http://localhost:8000"
    );

    static async createRoom(name: string): Promise<Room> {
        const url = new URL("", this.rootUrl);
        url.pathname += "/room";
        const headers = new Headers();
        headers.set("Content-Type", "application/json");
        const request = new Request(url.toString(), {
            headers,
            method: "POST",
            mode: "cors",
            body: JSON.stringify({
                name
            })
        });
        const response = await fetch(request);
        return await response.json();
    }

    static async createPlayer(roomId: number, name: string): Promise<Player> {
        const url = new URL("", this.rootUrl);
        url.pathname += `/player`;
        const headers = new Headers();
        headers.set("Content-Type", "application/json");
        const request = new Request(url.toString(), {
            headers,
            method: "POST",
            mode: "cors",
            body: JSON.stringify({
                name,
                room: {
                    id: roomId
                }
            })
        });
        const response = await fetch(request);

        const playerJson = await response.json();
        return new Player(playerJson);
    }

    static async fetchRoom(roomId: number): Promise<Room> {
        const url = new URL("", this.rootUrl);
        url.pathname += `/room/${roomId}`;
        const request = new Request(url.toString(), {
            method: "GET",
            mode: "cors"
        });
        const response = await fetch(request);
        await RestApi.assertValidResponseStatus(response);

        return await response.json();
    }

    static async joinRoom(playerId: string, roomId: number): Promise<Player>{
        const url = new URL("", this.rootUrl);
        url.pathname += `/player/${playerId}/room`;
        const headers = new Headers();
        headers.set("Content-Type", "application/json");
        const request = new Request(url.toString(), {
            headers,
            method: "POST",
            mode: "cors",
            body: JSON.stringify({
                id: roomId
            })
        });
        const response = await fetch(request);
        return  new Player(await response.json());
    }

    static async leaveRoom(playerId: string, roomId: number): Promise<Player>{
        const url = new URL("", this.rootUrl);
        url.pathname += `/player/${playerId}/room`;
        const request = new Request(url.toString(), {
            method: "DELETE",
            mode: "cors"
        });
        const response = await fetch(request);

        return new Player(await response.json());
    }

    private static async assertValidResponseStatus(response: Response){
        if (!response.ok){
            let message = response.statusText;
            try {
                const errorResponse = await response.json();
                message = errorResponse.message || message;
            } catch(e){

            }
            throw new Error(message);
        }
    }
}
