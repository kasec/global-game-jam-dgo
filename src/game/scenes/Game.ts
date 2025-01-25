import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    gameText: Phaser.GameObjects.Text;
    platforms: Phaser.Physics.Arcade.StaticGroup;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;

    constructor() {
        super("Game");
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0xf44e38);

        this.player = this.physics.add.sprite(80, 45, "pc");
        this.player.setCollideWorldBounds(true);

        EventBus.emit("current-scene-ready", this);
    }

    update() {
        this.cursors = this.input.keyboard?.createCursorKeys();

        console.log("this.cursors ", this.cursors);

        if (this.cursors) {
            if (this.cursors.left.isDown) {
                this.player.setVelocityX(-160);

                this.player.anims.play("left", true);
            } else if (this.cursors.right.isDown) {
                this.player.setVelocityX(160);

                this.player.anims.play("right", true);
            } else {
                this.player.setVelocityX(0);

                this.player.anims.play("turn");
            }

            if (this.cursors.up.isDown && this.player.body.touching.down) {
                this.player.setVelocityY(-330);
            }
        }
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}

