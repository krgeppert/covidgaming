import * as React from "react";
import { Component, MouseEventHandler } from "react";
import { GameModel } from "../../models/games/GameModel";
import {
    Button,
    Container,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography
} from "@material-ui/core";
import { GameJson, PlayerJson } from "../../RestApi";
import { TeamPicker } from "../widgets/TeamPicker";

interface Props {
    roomId: number;
    game: GameJson;
    player: PlayerJson;
}

interface State {
    mouseMovePageX?: number;
    sliderContainerElement?: HTMLDivElement;
}

export class WaveAmplitude extends Component<Props, State> {
    state: State = {};

    private readonly game: GameModel;

    private gameSubscription?: Promise<() => void>;
    private sliding: boolean = false;

    constructor(props: Readonly<Props>) {
        super(props);
        this.game = new GameModel(props.game, props.roomId, props.player);
    }

    private setSliderElement = (sliderElement: HTMLDivElement) => {
        this.setState({ sliderContainerElement: sliderElement });
    };

    private handleMousemove = (evt: MouseEvent) => {
        this.setState({ mouseMovePageX: evt.pageX });
    };
    private handleMouseup = () => {
        this.removeWindowListeners();
        this.game.changeSliderPosition(this.getSliderPosition());
    };
    private startSliding: MouseEventHandler = (evt) => {
        evt.preventDefault();
        this.sliding = true;

        window.addEventListener("mousemove", this.handleMousemove);
        window.addEventListener("mouseup", this.handleMouseup);
    };

    componentDidMount(): void {
        this.gameSubscription = this.game.connectToGameUpdates(() => {
            this.forceUpdate();
        });
    }

    componentWillUnmount(): void {
        this.removeWindowListeners();
    }

    render() {
        if (!this.game.isStarted()) {
            return (
                <>
                    <TeamPicker game={this.game} />
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
            return this.renderGameView();
        }
    }

    private renderEventList() {
        const events = this.game.getEventsSortedByDate(true);
        return (
            <Paper>
                <Typography variant={"h6"}> Game Events</Typography>
                <List>
                    {events.map((gameEvent, index) => (
                        <ListItem
                            key={gameEvent.id}
                            selected={gameEvent === this.game.getLatestEvent()}
                        >
                            <ListItemText>
                                {gameEvent.getMessage()}
                            </ListItemText>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        );
    }

    private renderGameView() {
        return (
            <Container style={{ display: "flex" }}>
                <Paper
                    style={{ flexGrow: 1, padding: "10px", display: "flex" }}
                >
                    {this.renderTheGradientThing()}
                </Paper>
                {this.renderEventList()}
            </Container>
        );
    }

    private renderTheGradientThing() {
        return (
            <div
                style={{
                    flexGrow: 1,
                    position: "relative",
                    height: "100px"
                }}
            >
                <div
                    ref={this.setSliderElement}
                    style={{
                        height: "100%",
                        border: "1px solid black",
                        opacity: "0.7",
                        background:
                            "linear-gradient(to right, red ,purple, blue)"
                    }}
                />
                {this.renderSlider()}
                {this.game.playerIsClueGiver()
                    ? this.renderSliderTargetZone()
                    : this.renderTheOtherFuckingThing()}
            </div>
        );
    }

    private renderTheOtherFuckingThing() {}

    private renderSliderTargetZone() {
        return this.game.getGuessZones().map((zone) => (
            <div
                key={zone.start}
                style={{
                    position: "absolute",
                    left: `${zone.start * 100}%`,

                    display: "inline-block",
                    height: "100%",
                    width: `${(zone.end - zone.start) * 100}%`,
                    top: "0",
                    boxSizing: "border-box",
                    border: "3px solid gray",
                    textAlign: "center",
                    fontSize: "20px",
                    verticalAlign: "middle"
                }}
            >
                {zone.value}
            </div>
        ));
    }

    private renderSlider() {
        return (
            <div
                onMouseDown={this.startSliding}
                style={{
                    display: "inline-block",
                    position: "absolute",
                    top: "-10%",
                    left: `${this.getSliderPosition() * 100}%`,
                    width: "5px",
                    height: "120%",
                    background: "black",
                    zIndex: 1,
                    cursor: this.game.playerIsClueGiver() ? "auto" : "pointer"
                }}
            />
        );
    }

    private removeWindowListeners() {
        window.removeEventListener("mousemove", this.handleMousemove);
        window.removeEventListener("mouseup", this.handleMouseup);
    }

    private getSliderPosition(): number {
        const movePosition = this.state.mouseMovePageX;
        const sliderElement = this.state.sliderContainerElement;

        if (typeof movePosition !== "number" || !sliderElement) {
            return this.game.getSliderPosition();
        }
        const boundingClientRect = sliderElement.getBoundingClientRect();
        const boundedPosition = Math.min(
            Math.max(movePosition, boundingClientRect.left),
            boundingClientRect.right
        );
        return (
            (boundedPosition - boundingClientRect.left) /
            boundingClientRect.width
        );
    }
}
