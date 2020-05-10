import * as React from "react";
import {Component} from "react";
import {GameModel} from "../../models/games/GameModel";
import {
    Button,
    Container,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    ListSubheader
} from "@material-ui/core";
import {GameJson, PlayerJson} from "../../RestApi";

interface Props {
    roomId: number;
    game: GameJson;
    player: PlayerJson;
}

export class BaseGameView extends Component<Props> {
    private readonly game: GameModel;

    private gameSubscription?: Promise<() => void>;

    constructor(props: Readonly<Props>) {
        super(props);
        this.game = new GameModel(props.game, props.roomId, props.player);
    }

    componentDidMount(): void {
        this.gameSubscription = this.game.connectToGameUpdates(() => {
            this.forceUpdate();
        });
    }

    render() {
        if (!this.game.isStarted()) {
            return (
                <>
                    {this.renderTeamPicker()}
                    <Button
                        onClick={() => {
                            this.game.start();
                        }}
                    >
                        Start Game
                    </Button>
                </>
            );
        } else {
            return this.renderEventList();
        }
    }

    private renderEventList() {
        return (
            <List>
                {this.game.gameEvents.map((gameEvent) => (
                    <ListItem
                        key={gameEvent.id}
                        selected={gameEvent === this.game.getLatestEvent()}
                    >
                        <ListItemText>{gameEvent.getMessage()}</ListItemText>
                    </ListItem>
                ))}
            </List>
        );
    }

    private renderTeamPicker() {
        return (
            <>
                <List subheader={<ListSubheader>Participants</ListSubheader>}>
                    {this.game.participants
                        .filter((participant) => {
                            return !this.game.playerIsOnTeam(participant);
                        })
                        .map((participant) => {
                            return this.renderTeamPickerPLayerView(
                                participant
                            );
                        })}
                </List>
                <Container style={{display: "flex"}}>
                    {[1, 2].map((teamNumber) => {
                        const teamMembers = this.game.gameJson[
                            `team${teamNumber}` as "team1" | "team2"
                            ];
                        return (
                            <List
                                style={{width: "50%"}}
                                key={teamNumber}
                                subheader={
                                    <ListSubheader>
                                        Team {teamNumber}
                                    </ListSubheader>
                                }
                            >
                                {teamMembers?.map((participant) => {
                                    return this.renderTeamPickerPLayerView(
                                        participant,
                                        teamNumber as 1 | 2
                                    );
                                })}
                            </List>
                        );
                    })}
                </Container>
                <Button
                    onClick={() => {
                        this.game.randomizeTeams();
                    }}
                >
                    Randomize
                </Button>
            </>
        );
    }

    private renderTeamPickerPLayerView(
        participant: PlayerJson,
        teamNumber?: 1 | 2,
    ) {
        return <ListItem key={participant.id} divider={true}>
            <ListItemText>{participant.name}</ListItemText>

            <ListItemSecondaryAction>
                {!teamNumber && (
                    <Button
                        color={"primary"}
                        onClick={() => {
                            this.game.toggleTeam(participant, 1);
                        }}
                    >
                        Team 1
                    </Button>
                )}
                {!teamNumber && (
                    <Button
                        color={"primary"}
                        onClick={() => {
                            this.game.toggleTeam(participant, 2);
                        }}
                    >
                        Team 2
                    </Button>
                )}
                {teamNumber && (
                    <Button
                        color={"primary"}
                        onClick={() => {
                            this.game.toggleTeam(participant, teamNumber);
                        }}
                    >
                        Remove
                    </Button>
                )}
            </ListItemSecondaryAction>
        </ListItem>;
    }
}
