class EnnemiCerise extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, image){
        super(scene, x, y, image);

        this.saut = false;

        this.anims.play('cerise', true);
        
        scene.add.existing(this);
        scene.ennemis.add(this);
    }

    ia(player){
        if(player.body.x < this.body.x){
            this.flipX = false;
        }

        else if(player.body.x > this.body.x){
            this.flipX = true;
        }

        if(player.body.velocity.y < 0 && player.body.y < this.body.y && !this.saut && Math.abs(player.body.x-this.body.x) < 300){
            this.saut = true;
            this.body.setVelocityY(-200);
        }

        if(this.body.velocity.y == 0){
            this.saut = false;
        
        }
    }
}