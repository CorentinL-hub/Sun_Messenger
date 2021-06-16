class Menu extends Phaser.Scene {
    
    constructor(){
        super("menu");
    }

    preload(){
        this.load.atlas("player", "asset/Poti.png","asset/Poti.json")
        this.load.spritesheet("manaBar", "asset/mana_bar.png", { frameWidth: 75, frameHeight: 158 })
        this.load.spritesheet("lifeBar", "asset/life_bar.png", { frameWidth: 90, frameHeight: 154 })
        this.load.image("energy", "asset/energy.png")
        this.load.image("life", "asset/life.png")

        //Tiled
        this.load.image("tileset", "tiled/Tileset.png");
        this.load.tilemapTiledJSON("stage1", "tiled/stage1.json");
        this.load.tilemapTiledJSON("stage2", "tiled/stage2.json");
        this.load.image("background", "asset/Background.png")
    }

    create(){
        this.scene.start('stage1')
    }

    update(){

    }
}