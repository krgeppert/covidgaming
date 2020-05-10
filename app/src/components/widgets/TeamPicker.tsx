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
import * as React from "react";
import {Component} from "react";
import {PlayerJson} from "../../RestApi";

export class TeamPicker extends Component<{game: GameModel}> {

    render() {
        const game = this.props.game;
        return (
            <>
                <List subheader={<ListSubheader>Participants</ListSubheader>}>
                    {game.participants
                        .filter((participant) => {
                            return !game.playerIsOnTeam(participant);
                        })
                        .map((participant) => {
                            return this.renderTeamPickerPLayerView(
                                participant
                            );
                        })}
                </List>
                <Container style={{display: "flex"}}>
                    {[1, 2].map((teamNumber) => {
                        const teamMembers = game.gameJson[
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
                        game.randomizeTeams();
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
        const game = this.props.game;
        return <ListItem key={participant.id} divider={true}>
            <ListItemText>{participant.name}</ListItemText>

            <ListItemSecondaryAction>
                {!teamNumber && (
                    <Button
                        color={"primary"}
                        onClick={() => {
                            game.toggleTeam(participant, 1);
                        }}
                    >
                        Team 1
                    </Button>
                )}
                {!teamNumber && (
                    <Button
                        color={"primary"}
                        onClick={() => {
                            game.toggleTeam(participant, 2);
                        }}
                    >
                        Team 2
                    </Button>
                )}
                {teamNumber && (
                    <Button
                        color={"primary"}
                        onClick={() => {
                            game.toggleTeam(participant, teamNumber);
                        }}
                    >
                        Remove
                    </Button>
                )}
            </ListItemSecondaryAction>
        </ListItem>;
    }
}
