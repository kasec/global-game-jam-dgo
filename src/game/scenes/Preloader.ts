import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {}

  preload() {
    this.load.setPath("assets");

    this.load.spritesheet("player", "player.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.audio("step", "step.wav");
    this.load.image("bed", "bed.png");
    this.load.image("interaction-area", "interaction-area.png");
    this.load.image("bedroom", "bedroom.png");
    this.load.image("floor", "floor.png");
    this.load.image("table", "table.png");
    this.load.image("art", "art.png");
    this.load.image("door", "door.png");
    this.load.image("corridor", "corridor.png");
    this.load.image("npc", "npc.png");
    this.load.image("bedroom-graffiti", "bedroom-graffiti.png");
  }

  create() {
    this.scene.start("MainScene");
  }
}

