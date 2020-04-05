import * as React from "react";
import { ChangeEvent, Component } from "react";
import { Player, RestApi, Room } from "../../RestApi";
import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    TextField,
    Toolbar,
    Typography
} from "@material-ui/core";

import { RouterProps } from "../Router";
import { Game } from "../games/Game";

interface State {
    player?: Player;
    room?: Room;
    playerId?: string;
    playerName: string;
}

export class RoomPage extends Component<RouterProps, State> {
    state: State = {
        playerName: "",
        playerId: window.localStorage.getItem("playerId") || undefined
    };

    private readonly handleNameChange = (
        evt: ChangeEvent<HTMLInputElement>
    ) => {
        this.setState({
            playerName: evt.target.value
        });
    };
    private handlePlayerCreate = async () => {
        const roomId = this.state.room!.id;
        const player = await RestApi.createPlayer(
            roomId,
            this.state.playerName
        );
        const room = await RestApi.fetchRoom(roomId);

        localStorage.setItem("playerId", player.id);
        this.setState({
            player,
            room
        });
    };

    async componentDidMount() {
        const searchParams = new URLSearchParams(location.search);
        const roomId = Number(searchParams.get("roomId")!);
        const playerId = this.state.playerId;
        if (playerId) {
            const player = await RestApi.joinRoom(playerId, roomId);
            this.setState({ player });
        }
        const room = await RestApi.fetchRoom(roomId);
        this.setState({
            room
        });
    }

    render() {
        return (
            <>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6">
                            {this.state.room?.name}
                        </Typography>
                        <Button color="inherit">Leave Room</Button>
                    </Toolbar>
                </AppBar>
                <Container>
                    {(() => {
                        if (
                            !this.state.room ||
                            (this.state.playerId && !this.state.player)
                        ) {
                            return <CircularProgress />;
                        } else if (!this.state.player) {
                            return this.renderPlayerForm();
                        } else {
                            return this.renderRoomContent();
                        }
                    })()}
                </Container>
            </>
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
            <>
                <Typography variant={"h6"}>Players</Typography>
                <Paper>
                    <List>
                        {this.state.room?.players.map((player) => (
                            <ListItem key={player.id} divider={true}>
                                <ListItemText
                                    primary={player.name}
                                    secondary={
                                        player.id === this.state.room?.admin?.id
                                            ? "Room Admin"
                                            : ""
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </>
        );
    }
}
