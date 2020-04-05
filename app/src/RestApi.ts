export interface Room {
    id: number;
    name: string;
    players: Player[];
    gameId?: string;
    admin?: Player;
}

export interface Player {
    name: string;
    id: string;
}

export class RestApi {
    private static rootUrl = new URL(
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

        return await response.json();
    }

    static async fetchRoom(roomId: number): Promise<Room> {
        const url = new URL("", this.rootUrl);
        url.pathname += `/room/${roomId}`;
        const request = new Request(url.toString(), {
            method: "GET",
            mode: "cors"
        });
        const response = await fetch(request);
        return await response.json();
    }

    static async joinRoom(playerId: string, roomId: number) {
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

        return await response.json();
    }
}
