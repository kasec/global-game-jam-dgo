import { Scene } from "phaser";

const SPRITES_SCALE = 6;
const PLAYER_VELOCITY = 70 * SPRITES_SCALE;

export class MainScene extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  bedroomObjects: Phaser.Physics.Arcade.StaticGroup;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  stepEvent: Phaser.Time.TimerEvent;
  interObject: Phaser.Types.Physics.Arcade.SpriteWithStaticBody | null;
  playerMoving: boolean;
  lastKeyDown: string = "down";
  back: boolean = false;
  gameText: Phaser.GameObjects.Text;

  constructor() {
    super("MainScene");
  }

  preload() { }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x252446);

    this.cursors = this.input.keyboard?.createCursorKeys();

    this.add
      .image(this.renderer.width / 2, this.renderer.height / 2, "bedroom")
      .setScale(6);
    this.gameText = this.add.text(512, 100, 'Let\'s play', {
      fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
      stroke: '#000000', strokeThickness: 8,
      align: 'center'
    }).setOrigin(0.5).setDepth(100);

    this.gameText = this.add.text(512, 330, 'Hit space bar!', {
      fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
      stroke: '#000000', strokeThickness: 8,
      backgroundColor: 'grey',
      align: 'center'
    }).setOrigin(0.5).setDepth(100);

    this.bedroomObjects = this.physics.add.staticGroup([
      this.physics.add
        .staticSprite(104, 294, "bed")
        .setScale(6),
      this.physics.add
        .staticSprite(604, 294, "table")
        .setScale(6),
      this.physics.add
        .staticSprite(404, 194, "art")
        .setScale(6),
      this.physics.add
        .staticSprite(this.renderer.width - 48, 246, "door")
        .setScale(6)
    ]);

    this.physics.add
      .staticSprite(400, 300, "npc")
      .setScale(6)
      .setName("pnc")

    this.player = this.physics.add
      .sprite(
        !this.back ? this.renderer.width / 2 : this.renderer.width,
        this.renderer.height - 66,
        "player"
      )
      .setScale(6);

    // Customize the collider size
    this.player.body.setSize(11, 15);

    // Customize the collider offset
    this.player.body.setOffset(2, 1);

    this.player.setCollideWorldBounds(true);

    this.stepEvent = this.time.addEvent({
      delay: 250,
      repeat: -1,
      callbackScope: this,
      callback: () => {
        if (this.playerMoving) {
          this.sound.play("step", { volume: 0.5 });
        }
      },
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
      key: "right",
      frames: this.anims.generateFrameNumbers("player", {
        start: 6,
        end: 9,
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
  }

  update() {
    this.player.body.setVelocity(0);

    if (this.cursors?.left.isDown) {
      this.player.body.setVelocityX(-PLAYER_VELOCITY);
    } else if (this.cursors?.right.isDown) {
      this.player.body.setVelocityX(PLAYER_VELOCITY);
    }

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
    } else if (this.cursors?.down.isDown) {
      this.lastKeyDown = "down";
    } else {
      this.player.anims.stop();
      this.player.anims.play(`idle-${this.lastKeyDown}`, true);
      this.playerMoving = false;
    }

    // Press space to interact with an object
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
