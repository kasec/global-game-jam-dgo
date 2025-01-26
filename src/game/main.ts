import { Boot } from "./scenes/Boot";
import { Game as MainGame } from "./scenes/Game";
import { AUTO, Game } from "phaser";
import { Preloader } from "./scenes/Preloader";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: 960,
  height: 540,
  physics: {
    default: "arcade",
    arcade: {
      tileBias: 20,
      debug: true,
    },
  },
  input: {
    keyboard: true,
  },
  pixelArt: true,
  roundPixels: true,
  parent: "game-container",
  backgroundColor: "#201533",
  scene: [Boot, Preloader, MainGame],
};

const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
};

export default StartGame;

