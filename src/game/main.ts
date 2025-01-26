import { Boot } from "./scenes/Boot";
import { Bedroom } from "./scenes/Bedroom";
import { Corridor } from "./scenes/Corridor";
import { AUTO, Game } from "phaser";
import { Preloader } from "./scenes/Preloader";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: 960,
  height: 360,
  physics: {
    default: "arcade",
  },
  input: {
    keyboard: true,
  },
  pixelArt: true,
  roundPixels: true,
  parent: "game-container",
  backgroundColor: "#201533",
  scene: [Boot, Preloader, Bedroom, Corridor],
};

const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
};

export default StartGame;

