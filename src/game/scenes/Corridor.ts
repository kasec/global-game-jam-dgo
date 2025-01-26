import { Scene } from "phaser";

const SPRITES_SCALE = 6;
const PLAYER_VELOCITY = 70 * SPRITES_SCALE;

export class Corridor extends Scene {
  exit: boolean;
  camera: Phaser.Cameras.Scene2D.Camera;
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  bedroomObjects: Phaser.Physics.Arcade.StaticGroup;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  stepEvent: Phaser.Time.TimerEvent;
  interObject: Phaser.Types.Physics.Arcade.SpriteWithStaticBody | null;
  interArea: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  blinkInter: Phaser.Time.TimerEvent;
  playerMoving: boolean;
  lastKeyDown: string = "down";

  constructor() {
    super("Corridor");
  }

  preload() { }

  init() {
    this.exit = false;
  }

  create() {
    this.camera = this.cameras.main;

    this.camera.setBackgroundColor(0x252446);

    this.cursors = this.input.keyboard?.createCursorKeys();

    const bg = this.add.image(0, 0, "corridor").setScale(6).setOrigin(0, 0);

    this.camera.setBounds(0, 0, bg.displayWidth, bg.displayHeight);

    this.player = this.physics.add
      .sprite(66, this.renderer.height - 66, "player")
      .setScale(6);


    const npc = this.physics.add
      .staticSprite(600, 294, "npc")
      .setScale(6)
      .setName("pnc")
      .setData("description", "Hi There! How is it going?")
      .refreshBody();

    this.camera.startFollow(this.player, true);

    // Customize the collider size
    this.player.body.setSize(11, 15);

    // Customize the collider offset
    this.player.body.setOffset(2, 1);

    this.interArea = this.physics.add
      .image(
        this.renderer.width / 2,
        this.renderer.height / 2,
        "interaction-area"
      )
      .setScale(6);

    this.physics.add.overlap(
      this.interArea,
      npc,
      (_, bedroomObj: unknown) => {
        this.interObject =
          bedroomObj as Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
      }
    );

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

    if (!this.exit) {
      if (this.cursors?.left.isDown) {
        this.player.body.setVelocityX(-PLAYER_VELOCITY);
      } else if (this.cursors?.right.isDown) {
        this.player.body.setVelocityX(PLAYER_VELOCITY);
      }
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

    this.interArea.setX(this.player.x);
    this.interArea.setY(this.player.y);

    if (this.lastKeyDown === "left") {
      this.interArea.setX(this.player.x - 48);
    } else if (this.lastKeyDown === "right") {
      this.interArea.setX(this.player.x + 48);
    } else if (this.lastKeyDown === "up") {
      this.interArea.setY(this.player.y - 48);
    }

    // Press space to interact with an object
    if (this.interArea.body.embedded) {
      if (this.cursors?.space.isDown) {
        // The object can have data, such as a description
        // TODO: replace alert with the text boxes
        alert(this.interObject?.getData("description"));

        if (this.interObject?.name === "door") {
          this.changeScene();
        }
      }
    } else if (this.interObject) {
      this.interObject?.setTint(0xffffff, 0xffffff, 0xffffff, 0xffffff);
      this.interObject = null;
    }

    if (this.player.x + 16 < this.camera.getBounds().x && !this.exit) {
      this.exit = true;
      this.cameras.main.fadeOut(250, 0, 0, 0);

      this.cameras.main.once(
        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
        () => {
          this.scene.start("Bedroom", { back: true });
        }
      );
    }
  }

  changeScene() {
    this.scene.start("Corridor");
  }
}

