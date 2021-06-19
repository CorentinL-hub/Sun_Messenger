class Menu extends Phaser.Scene {
    
    constructor(){
        super("menu");
    }

    preload(){
        this.load.atlas("player", "asset/Poti.png","asset/Poti.json");
        this.load.atlas("cerise", "asset/Cerise.png","asset/Cerise.json");
        this.load.atlas("poire", "asset/Poire.png","asset/Poire.json");
        this.load.atlas("glace", "asset/Glace.png","asset/Glace.json");

        this.load.spritesheet("manaBar", "asset/mana_bar.png", { frameWidth: 75, frameHeight: 158 });
        this.load.spritesheet("lifeBar", "asset/life_bar.png", { frameWidth: 90, frameHeight: 154 });
        this.load.spritesheet("legumeCounter", "asset/legumeCounter.png", { frameWidth: 171, frameHeight: 95 });
        this.load.image("energy", "asset/energy.png");
        this.load.image("life", "asset/life.png");
        this.load.image("legume", "asset/legume.png");
        this.load.image("attack", "asset/Attack.png");
        this.load.image("projectile", "asset/Projectile.png");

        //Tiled
        this.load.image("tileset", "tiled/Tileset.png");
        this.load.image("tileset2", "tiled/Tileset2.png");
        this.load.tilemapTiledJSON("stage1", "tiled/stage1.json");
        this.load.tilemapTiledJSON("stage2", "tiled/stage2.json");
        this.load.tilemapTiledJSON("stage3", "tiled/Stage3.json");
        this.load.image("background", "asset/Background.png")
    }

    create(){

        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNames('player', {
                prefix: 'Run',
                start: 1,
                end: 5,
                zeroPad: 1
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'face',
            frames: this.anims.generateFrameNames('player', {
                prefix: 'Face',
                start: 1,
                end: 1,
                zeroPad: 1
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'superJump',
            frames: this.anims.generateFrameNames('player', {
                prefix: 'Superjump',
                start: 1,
                end: 12,
                zeroPad: 1
            }),
            frameRate: 10,
            repeat: 0,
        });

        this.anims.create({
            key: 'laser',
            frames: this.anims.generateFrameNames('player', {
                prefix: 'Laser',
                start: 1,
                end: 32,
                zeroPad: 1
            }),
            frameRate: 10,
            repeat: 0,
        });

        this.anims.create({
            key: 'cerise',
            frames: this.anims.generateFrameNames('cerise', {
                prefix: 'CeriseJump',
                start: 1,
                end: 18,
                zeroPad: 1
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: 'poireIdle',
            frames: this.anims.generateFrameNames('poire', {
                prefix: 'Poire',
                start: 1,
                end: 2,
                zeroPad: 1
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: 'poireRun',
            frames: this.anims.generateFrameNames('poire', {
                prefix: 'Poire',
                start: 3,
                end: 6,
                zeroPad: 1
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: 'glace',
            frames: this.anims.generateFrameNames('glace', {
                prefix: 'Glace',
                start: 1,
                end: 2,
                zeroPad: 1
            }),
            frameRate: 2,
            repeat: -1,
        });

        this.anims.create({
            key: 'glaceAttack',
            frames: this.anims.generateFrameNames('glace', {
                prefix: 'GlaceAttaque',
                start: 1,
                end: 1,
                zeroPad: 1
            }),
            frameRate: 1,
            repeat: 0,
        });
        
        this.scene.start('stage1');
    }

    update(){

    }
}