import { EventBus } from "../EventBus";
import { Scene } from "phaser";

const PLAYER_VELOCITY = 80;

let bedroom_objects;
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
  preload() {
    this.load.image('bed', 'assets/bed-sprite.png');
    this.load.image('bedroom-window', 'assets/bedroom-window.png');
    this.load.image('bedroom-table', 'assets/bed-table.png');
    this.load.image('bedroom-carpet', 'assets/bed-carpet.png');
    this.load.image('bedroom-sofa', 'assets/bedroom-sofa.png');
    this.load.image('bedroom-tv', 'assets/bedroom-tv.png');
  }
  create() {
    this.lastKeyDown = "down";
    
    bedroom_objects = this.physics.add.staticGroup()
    bedroom_objects.create(15, 10, 'bed').setScale(3).refreshBody();
    // TO-DO need to remove extra spaces from sprites, so the player freely move 
    // bedroom_objects.create(50, -16, 'bedroom-window').setScale(2).refreshBody();
    // bedroom_objects.create(140, -16, 'bedroom-window').setScale(2).refreshBody();
    bedroom_objects.create(0, 50, 'bedroom-table').setScale(2).refreshBody();
    bedroom_objects.create(155, 85, 'open-door').refreshBody();
    bedroom_objects.create(100, 38, 'bedroom-sofa').setScale(2).refreshBody();
    bedroom_objects.create(100, 58, 'bedroom-carpet').setScale(2).refreshBody();
    bedroom_objects.create(100, 70, 'bedroom-tv').setScale(2).refreshBody();
    
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0xff8e80);

    this.player = this.physics.add.sprite(80, 45, "player");
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, bedroom_objects);
    this.stepEvent = this.time.addEvent({
      delay: 220,
      repeat: -1,
      callbackScope: this,
      callback: () => {
        if (this.playerMoving) {
          this.sound.play("step", { volume: 0.25 });
        }
      },
    });

    this.anims.create({
      key: "down",
      frames: this.anims.generateFrameNumbers("player", {
        start: 1,
        end: 4,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", {
        start: 6,
        end: 9,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "up",
      frames: this.anims.generateFrameNumbers("player", {
        start: 11,
        end: 14,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", {
        start: 16,
        end: 19,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "idle-down",
      frames: [{ key: "player", frame: 0 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "idle-right",
      frames: [{ key: "player", frame: 5 }],
      frameRate: 20,
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

    if (this.cursors?.left.isDown) {
      this.lastKeyDown = "left";
      this.player.setVelocityX(-PLAYER_VELOCITY);

      this.player.anims.play("left", true);
    } else if (this.cursors?.right.isDown) {
      this.lastKeyDown = "right";
      this.player.setVelocityX(PLAYER_VELOCITY);

      this.player.anims.play("right", true);
    } else if (this.cursors?.up.isDown) {
      this.lastKeyDown = "up";
      this.player.setVelocityY(-PLAYER_VELOCITY);

      this.player.anims.play("up", true);
    } else if (this.cursors?.down.isDown) {
      this.lastKeyDown = "down";
      this.player.setVelocityY(PLAYER_VELOCITY);

      this.player.anims.play("down", true);
    } else {
      this.player.setVelocityY(0);
      this.player.setVelocityX(0);
      this.player.anims.play(`idle-${this.lastKeyDown}`, true);
    }

    this.playerMoving =
      this.cursors?.left.isDown ||
      this.cursors?.right.isDown ||
      this.cursors?.up.isDown ||
      this.cursors?.down.isDown ||
      false;
  }

  changeScene() {
    this.scene.start("GameOver");
  }
}

