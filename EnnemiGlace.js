class EnnemiGlace extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, image){
        super(scene, x, y, image);

        this.attack = false;
        this.cooldown = 0;
        this.projectile = false;
        this.direction = "left";
        this.timer = 0;

        this.anims.play('glace', true);
        
        scene.add.existing(this);
        scene.ennemiGlace.add(this);
    }

    ia(player){

        if(this.body.velocity.x > 0){
            this.flipX = true;
        }

        else if(this.body.velocity.x < 0){
            this.flipX = false;
        }

        if(this.cooldown > 0){
            this.cooldown--;
        }

        if(this.attack){
            this.attack = false;
        }

        if(this.cooldown>150){
            this.anims.play('glaceAttack', true);
        }

        else{
            this.anims.play('glace', true);
        }

        if(Math.abs(player.body.x-this.body.x) <= 250 && player.body.y>this.body.y && this.cooldown == 0){
            this.attack = true;
            this.cooldown = 180;

        }

        if (this.direction == "left"){
            this.timer++;
            this.body.setVelocityX(-100);
            if (this.timer >= 360){
                this.direction = "right";
            }
        }

        else{
            this.timer--;
            this.body.setVelocityX(100);
            if (this.timer <= 0){
                this.direction = "left";
            }
        }

        return this.attack;
    }
}