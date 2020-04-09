import {GameModel} from "./games/GameModel";
import {WaveAmplitude} from "./games/WaveAmplitude";

export interface GameInitializationConfig {
    gameClass: typeof GameModel,
    name: string
}

export class GameLauncher {
    static gameInitializers: GameInitializationConfig[] = [
        {
            gameClass: WaveAmplitude,
            name: WaveAmplitude.gameName
        }
    ];
}