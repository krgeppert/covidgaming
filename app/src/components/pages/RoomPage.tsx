import * as React from "react";
import { ChangeEvent, Component } from "react";
import { Player, RestApi, Room } from "../../RestApi";
import {
    Button,
    CircularProgress,
    Container, List, ListItem, ListItemText,
    Paper,
    TextField
} from "@material-ui/core";
import { RouterProps } from "../Router";
import { Game } from "../games/Game";

interface State {
    player?: Player;
    room?: Room;
    playerName: string;
}

export class RoomPage extends Component<RouterProps, State> {
    state: State = {
        playerName: ""
    };

    private readonly handleNameChange = (
        evt: ChangeEvent<HTMLInputElement>
    ) => {
        this.setState({
            playerName: evt.target.value
        });
    };
    private handlePlayerCreate = async () => {
        const player = await RestApi.createPlayer(
            this.state.room!.id,
            this.state.playerName
        );
        this.setState({
            player
        });
    };

    componentDidMount(): void {
        const searchParams = new URLSearchParams(location.search);
        RestApi.fetchRoom(Number(searchParams.get("roomId")!)).then((room) => {
            this.setState({
                room
            });
        });
    }

    render() {
        return (
            <Container>
                {(() => {
                    if (!this.state.room) {
                        return <CircularProgress />;
                    } else if (!this.state.player) {
                        return this.renderPlayerForm();
                    } else {
                        return this.renderRoomContent();
                    }
                })()}
            </Container>
        );
    }

    private renderPlayerForm() {
        return (
            <Paper
                style={{
                    margin: "40px",
                    display: "flex",
                    padding: "20px",
                    flexDirection: "column",
                    alignItems: "center"
                }}
            >
                <Container>
                    <TextField
                        label="Your Alias"
                        value={this.state.playerName}
                        onChange={this.handleNameChange}
                    />
                    <Button
                        color="primary"
                        variant={"contained"}
                        onClick={this.handlePlayerCreate}
                    >
                        Submit
                    </Button>
                </Container>
            </Paper>
        );
    }

    private renderRoomContent() {
        const room = this.state.room!;
        return room.gameId ? (
            <Game room={room} />
        ) : (
            this.renderRoomSplashScreen()
        );
    }

    private renderRoomSplashScreen() {
        return (
            <List>
                {this.state.room?.players.map((player) => (
                    <ListItem>
                        <ListItemText
                            primary={player.name}
                            // secondary={player.lastModified}
                        />
                    </ListItem>
                ))}
            </List>
        );
    }
}
