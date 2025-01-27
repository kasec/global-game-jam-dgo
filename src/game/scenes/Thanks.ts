import { Scene } from "phaser";

export class Thanks extends Scene {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;

  constructor() {
    super("Thanks");
  }

  preload() {}

  create() {
    this.cameras.main.setBackgroundColor(0x252446);

    this.cursors = this.input.keyboard?.createCursorKeys();

    this.add
      .image(
        this.renderer.width / 2,
        this.renderer.height / 2,
        "bedroom-graffiti"
      )
      .setScale(6);

    this.add
      .text(512, 70, "Thanks for playing!", {
        fontFamily: "KiwiSoda",
        fontSize: 48,
        color: "#fcf660",
        stroke: "#201533",
        strokeThickness: 6,
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(100);

    this.add
      .text(512, 340, "Hit space bar to start again!", {
        fontFamily: "KiwiSoda",
        fontSize: 38,
        color: "#fcf660",
        stroke: "#201533",
        strokeThickness: 6,
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(100);
  }

  update() {
    if (this.cursors?.space.isDown) {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once(
        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
        () => {
          this.scene.start("Bedroom");
        }
      );
    }
  }
}

