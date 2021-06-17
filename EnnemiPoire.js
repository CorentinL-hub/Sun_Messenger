class EnnemiPoire extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, image){
        super(scene, x, y, image);

        this.anims.play('poire', true);

        scene.add.existing(this);
        scene.ennemis.add(this);
    }

    ia(player){
        
        if(player.body.x < this.body.x){
            this.flipX = false;
            this.body.setAccelerationX(-150);
        }

        else if(player.body.x > this.body.x){
            this.flipX = true;
            this.body.setAccelerationX(150);
        }

        if(this.body.velocity.x > 100){
            this.body.velocity.x = 100;
        }

        else if(this.body.velocity.x < -100){
            this.body.velocity.x = -100;
        }


    }
}