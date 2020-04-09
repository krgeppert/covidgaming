import {Component, FunctionComponent} from "react";
import {Room} from "../../RestApi";
import {GameModel} from "../../models/games/GameModel";
import * as React from "react";
import {webSocketApiInstance} from "../../WebSocketApi";

interface Props {
    game: GameModel;
}

interface State {
    game: GameModel
}

export class BaseGameView extends Component<Props>{
    state: State;


    constructor(props: Readonly<Props>) {
       super(props);
       this.state = {
           game: props.game
       }
    }

    componentDidMount(): void {
        webSocketApiInstance.subscribeToGameUpdates(this.props.game.id, (game)=>{
            this.setState({game});
        });
    }

    render() {
        return <div>Hello world</div>
    }
}
