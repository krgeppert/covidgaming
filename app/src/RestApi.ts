import { User } from "./models/User";

export interface GameEventJson {
    creator: PlayerJson;
    type: string;
    createdDate: string;
    id: number;
}

export interface GameJson {
    id: number;
    type: GameType;
    createdDate: string;
    participants: PlayerJson[];
    team1?: PlayerJson[];
    team2?: PlayerJson[];
    events?: GameEventJson[];
}

export interface Room {
    id: number;
    name: string;
    players: PlayerJson[];
    game?: GameJson;
    admin?: PlayerJson;
}

export interface PlayerJson {
    name: string;
    id: string;
}

export enum GameType {
    waveAmplitude = "waveAmplitude"
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

    static async createPlayer(roomId: number, name: string): Promise<User> {
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
        return new User(playerJson);
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

    static async joinRoom(playerId: string, roomId: number): Promise<User> {
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
        return new User(await response.json());
    }

    static async leaveRoom(playerId: string): Promise<User> {
        const url = new URL("", this.rootUrl);
        url.pathname += `/player/${playerId}/room`;
        const request = new Request(url.toString(), {
            method: "DELETE",
            mode: "cors"
        });
        const response = await fetch(request);

        return new User(await response.json());
    }

    private static async assertValidResponseStatus(response: Response) {
        if (!response.ok) {
            let message = response.statusText;
            try {
                const errorResponse = await response.json();
                message = errorResponse.message || message;
            } catch (e) {}
            throw new Error(message);
        }
    }

    static async createGame(
        roomId: number,
        selectedGame: GameType
    ): Promise<GameJson> {
        const url = new URL("", this.rootUrl);
        url.pathname += `/room/${roomId}/game`;
        const headers = new Headers();
        headers.set("Content-Type", "application/json");
        const request = new Request(url.toString(), {
            headers,
            method: "POST",
            mode: "cors",
            body: JSON.stringify({
                gameType: selectedGame
            })
        });
        const response = await fetch(request);

        return await response.json();
    }

    static async fetchGame(gameId: string): Promise<GameJson> {
        const url = new URL("", this.rootUrl);
        url.pathname += `/game/${gameId}`;
        const request = new Request(url.toString(), {
            method: "GET",
            mode: "cors"
        });
        const response = await fetch(request);
        await RestApi.assertValidResponseStatus(response);

        return await response.json();
    }

    static async updateTeam(roomId: number,gameId: number, teamId: number, players: PlayerJson[]): Promise<GameJson> {
        const url = new URL("", this.rootUrl);
        url.pathname += `/room/${roomId}/game/${gameId}/team/${teamId}`;
        const headers = new Headers();
        headers.set("Content-Type", "application/json");
        const request = new Request(url.toString(), {
            headers,
            method: "PUT",
            mode: "cors",
            body: JSON.stringify(players)
        });
        const response = await fetch(request);

        return await response.json();
    }
}
