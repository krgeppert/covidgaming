import * as React from "react";
import { ChangeEvent, Component } from "react";
import { GameType, PlayerJson, RestApi, Room } from "../../RestApi";
import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Paper,
    Radio,
    RadioGroup,
    TextField,
    Toolbar,
    Typography
} from "@material-ui/core";

import { RouterProps } from "../Router";
import { BaseGameView } from "../games/BaseGameView";
import { webSocketApiInstance } from "../../WebSocketApi";
import { StompSubscription } from "@stomp/stompjs";
import { User } from "../../models/User";
import { GameLauncher } from "../../models/GameLauncher";
import { GameModel } from "../../models/games/GameModel";

interface State {
    player?: User;
    room?: Room;
    playerId?: string;
    selectedGame?: GameType;
    playerName: string;
}

export class RoomPage extends Component<RouterProps, State> {
    state: State = {
        playerName: "",
        playerId: window.localStorage.getItem("playerId") || undefined
    };

    private roomSubscription?: StompSubscription;

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

    private readonly supportedGames = GameLauncher.gameInitializers;

    handleShareButton = async () => {
        await navigator.clipboard.writeText(window.location.href);
    };

    redirectToLobby = () => {
        this.props.history.push("/");
    };

    handleLeaveRoom = async () => {
        const room = this.state.room;
        const player = this.state.player;
        if (player && room) {
            await RestApi.leaveRoom(player.id);
        }
        this.redirectToLobby();
    };
    handleGameChange = (evt: ChangeEvent<HTMLInputElement>) => {
        this.setState({ selectedGame: evt.target.value as GameType });
    };
    startGame = async () => {
        const game = await RestApi.createGame(
            this.state.room!.id,
            this.state.selectedGame!
        );
    };

    async componentDidMount() {
        const searchParams = new URLSearchParams(location.search);
        const roomId = Number(searchParams.get("roomId")!);
        const playerId = this.state.playerId;
        if (playerId) {
            const player = await RestApi.joinRoom(playerId, roomId);
            this.setState({ player });
        }
        await this.fetchRoom(roomId);
        this.roomSubscription = await webSocketApiInstance.subscribeToRoomUpdates(
            roomId,
            (room) => {
                this.setState({ room });
            }
        );
    }

    componentWillUnmount(): void {
        this.roomSubscription?.unsubscribe();
    }

    private async fetchRoom(roomId: number) {
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
                        <Button color="inherit" onClick={this.handleLeaveRoom}>
                            Leave Room
                        </Button>
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
        const game = this.state.room?.game;
        return game ? (
            <BaseGameView
                roomId={this.state.room!.id}
                game={game}
                player={this.state.player!}
            />
        ) : (
            this.renderRoomSplashScreen()
        );
    }

    private renderRoomSplashScreen() {
        return (
            <>
                {this.renderOutOfRoomDialogue()}

                <Button color={"secondary"} onClick={this.handleShareButton}>
                    Copy Room Url
                </Button>
                <Typography variant={"h6"}>Games</Typography>
                {this.renderListOfGames()}

                <Typography variant={"h6"}>Users</Typography>
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
                                {this.userIsAdmin() &&
                                    player.id !== this.state.player?.id && (
                                        <ListItemSecondaryAction>
                                            <Button
                                                onClick={() => {
                                                    this.bootPlayer(player);
                                                }}
                                            >
                                                Boot
                                            </Button>
                                        </ListItemSecondaryAction>
                                    )}
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </>
        );
    }

    private userIsAdmin(): boolean {
        return !!this.state.player?.isAdminOf(this.state.room!);
    }

    private async bootPlayer(player: PlayerJson) {
        RestApi.leaveRoom(player.id);
    }

    private renderOutOfRoomDialogue() {
        if (
            this.state.room?.players.every(
                (playerInRoom) => playerInRoom.id !== this.state.player?.id
            )
        ) {
            return (
                <Dialog open={true}>
                    <DialogTitle id="alert-dialog-title">
                        {"Use Google's location service?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            You are no longer in this room.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={async () => {
                                await RestApi.joinRoom(
                                    this.state.player!.id,
                                    this.state.room!.id
                                );
                            }}
                            color="primary"
                        >
                            Rejoin
                        </Button>
                        <Button
                            onClick={this.redirectToLobby}
                            color="primary"
                            autoFocus
                        >
                            Leave
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        }
    }

    private renderListOfGames() {
        return (
            <>
                <FormControl component="fieldset">
                    <RadioGroup
                        value={this.state.selectedGame || ""}
                        onChange={this.handleGameChange}
                    >
                        {this.supportedGames.map((supportedGame) => (
                            <FormControlLabel
                                key={supportedGame.name}
                                value={supportedGame.name}
                                control={<Radio />}
                                label={supportedGame.name}
                            />
                        ))}
                    </RadioGroup>
                </FormControl>
                <Button onClick={this.startGame} color={"primary"}>
                    Start
                </Button>
            </>
        );
    }
}
