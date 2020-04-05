import * as React from "react";
import { ChangeEvent, Component } from "react";
import {
    Button,
    Container,
    Paper,
    TextField,
    Typography
} from "@material-ui/core";
import { RestApi } from "../../RestApi";
import { RouterProps } from "../Router";

interface State {
    roomId: string;
    roomName: string;
}

export class HomePage extends Component<RouterProps, State> {
    state: State = {
        roomId: "",
        roomName: ""
    };

    private readonly createRoom = async () => {
        const room = await RestApi.createRoom(this.state.roomName);
        this.redirectToRoom(room.id);
    };

    private readonly joinRoom = () => {};

    private readonly handleRoomIdChange = (
        evt: ChangeEvent<HTMLInputElement>
    ) => {
        this.setState({ roomId: evt.target.value });
    };
    private readonly handleRoomNameChange = (
        evt: ChangeEvent<HTMLInputElement>
    ) => {
        this.setState({ roomName: evt.target.value });
    };

    render() {
        return (
            <Container
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}
            >
                <Typography variant={"h1"} component="h1">
                    Covid Gaming
                </Typography>
                <Typography variant={"body1"} component="span">
                    Welcome to covid gaming. You can probably guess what this is
                    all about; come back when you've got your zoom hangout
                    ready.
                </Typography>
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
                            label="Room Id"
                            value={this.state.roomId}
                            onChange={this.handleRoomIdChange}
                        />
                        <Button color="primary" variant={"contained"}>
                            Join Room
                        </Button>
                    </Container>
                    <Typography variant={"subtitle2"} component={"div"}>
                        Or{" "}
                    </Typography>
                    <Container>
                        <TextField
                            label="Room Name"
                            value={this.state.roomName}
                            onChange={this.handleRoomNameChange}
                        />
                        <Button
                            color="secondary"
                            variant={"contained"}
                            onClick={this.createRoom}
                        >
                            Create Room
                        </Button>
                    </Container>
                </Paper>
            </Container>
        );
    }

    private redirectToRoom(roomId: string) {
        this.props.history.push(`/room?roomId=${roomId}`);
    }
}
