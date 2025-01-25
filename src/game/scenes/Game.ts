import { EventBus } from "../EventBus";
import { Scene } from "phaser";
const PLAYER_VELOCITY = 70 * 6;

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  gameText: Phaser.GameObjects.Text;
  platforms: Phaser.Physics.Arcade.StaticGroup;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  lastKeyDown: string;
  playerMoving: boolean;
  stepEvent: Phaser.Time.TimerEvent;

  constructor() {
    super("Game");
  }

  create() {
    this.lastKeyDown = "down";
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x252446);

    this.player = this.physics.add.sprite(80 * 6, 45 * 6, "player");
    this.player.setCollideWorldBounds(true);

    this.stepEvent = this.time.addEvent({
      delay: 220,
      repeat: -1,
      callbackScope: this,
      callback: () => {
        if (this.playerMoving) {
          this.sound.play("step", { volume: 0.5 });
        }
      },
    });

    this.anims.create({
      key: "down",
      frames: this.anims.generateFrameNumbers("player", {
        start: 1,
        end: 4,
      }),
      frameRate: 7,
      repeat: -1,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", {
        start: 6,
        end: 9,
      }),
      frameRate: 7,
      repeat: -1,
    });

    this.anims.create({
      key: "up",
      frames: this.anims.generateFrameNumbers("player", {
        start: 11,
        end: 14,
      }),
      frameRate: 7,
      repeat: -1,
    });

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", {
        start: 16,
        end: 19,
      }),
      frameRate: 7,
      repeat: -1,
    });

    this.anims.create({
      key: "idle-down",
      frames: [{ key: "player", frame: 0 }],
      frameRate: 10,
    });

    this.anims.create({
      key: "idle-right",
      frames: [{ key: "player", frame: 5 }],
      frameRate: 10,
    });

    this.anims.create({
      key: "idle-up",
      frames: [{ key: "player", frame: 10 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "idle-left",
      frames: [{ key: "player", frame: 15 }],
      frameRate: 20,
    });

    EventBus.emit("current-scene-ready", this);
  }

  update() {
    this.cursors = this.input.keyboard?.createCursorKeys();

    this.player.body.setVelocity(0);

    if (this.cursors?.left.isDown) {
      this.player.body.setVelocityX(-PLAYER_VELOCITY);
    } else if (this.cursors?.right.isDown) {
      this.player.body.setVelocityX(PLAYER_VELOCITY);
    }

    if (this.cursors?.up.isDown) {
      this.player.body.setVelocityY(-PLAYER_VELOCITY);
    } else if (this.cursors?.down.isDown) {
      this.player.body.setVelocityY(PLAYER_VELOCITY);
    }

    this.player.body.velocity.normalize().scale(PLAYER_VELOCITY);

    if (this.cursors?.left.isDown) {
      this.lastKeyDown = "left";
      this.player.anims.play("left", true);
      this.playerMoving = true;
    } else if (this.cursors?.right.isDown) {
      this.lastKeyDown = "right";
      this.player.anims.play("right", true);
      this.playerMoving = true;
    } else if (this.cursors?.up.isDown) {
      this.lastKeyDown = "up";
      this.player.anims.play("up", true);
      this.playerMoving = true;
    } else if (this.cursors?.down.isDown) {
      this.lastKeyDown = "down";
      this.player.anims.play("down", true);
      this.playerMoving = true;
    } else {
      this.player.anims.stop();
      this.player.anims.play(`idle-${this.lastKeyDown}`, true);
      this.playerMoving = false;
    }
  }

  changeScene() {
    this.scene.start("GameOver");
  }
}

