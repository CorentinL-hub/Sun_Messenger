class SceneFin extends Phaser.Scene {
    
    constructor(){
        super("sceneFin");
    }

    create(){
        this.add.image(800, 450, 'ecranFin');
        this.time.addEvent({ delay: 5000, callback: function(){this.scene.start('menu')}, callbackScope: this});

    }
}