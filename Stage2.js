class Stage2 extends Phaser.Scene {
    
    constructor(){
        super("stage2");
    }


    create(){
        this.control = this.scene.get('control');

        this.cursors = this.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.UP,
            'down': Phaser.Input.Keyboard.KeyCodes.DOWN, 
            'left': Phaser.Input.Keyboard.KeyCodes.LEFT,
            'right': Phaser.Input.Keyboard.KeyCodes.RIGHT,
            'space' : Phaser.Input.Keyboard.KeyCodes.SPACE,
            'a' : Phaser.Input.Keyboard.KeyCodes.A
        });

        this.add.image(800, 450, "background").setScrollFactor(0.05, 0);

        this.map = this.make.tilemap({ key: "stage2" });
        this.tileset = this.map.addTilesetImage("Tilesheet", "tileset");
        this.collision = this.map.createLayer("collision", this.tileset, 0, 0);

        this.manaBar = this.add.sprite(50, 300, "manaBar").setScrollFactor(0);

        this.lifeBar = this.add.sprite(50, 100, "lifeBar").setScrollFactor(0);

        this.player = this.physics.add.sprite(50, 800, "player").setSize(12, 48).setOffset(16,20);
        this.player.setCollideWorldBounds(true);

        this.playerSpeedX = 150;
        this.playerSpeedY = 320;

        this.hitbox = this.physics.add.image(this.player.x, this.player.y, 'attack').setOrigin(0, 0.5);
        this.hitbox.body.setAllowGravity(false);

        this.physics.add.collider(this.player, this.collision);
        this.collision.setCollisionByProperty({collides:true});

        this.camera = this.cameras.main.setSize(1600,900);
        this.camera.startFollow(this.player, true, 0.08, 0.08);
        this.camera.setBounds(0, 0, 3040, 928);

        this.player.on('animationcomplete', function(){
            if(keyPush == "B"){
                direction = "Jump";
                inputP[4] = false;
            }

            if(keyPush == "X"){
                direction = "Laser";
                inputP[5] = false;
            }
        }, this);

        this.collision.setTileLocationCallback(94, 23, 1, 2, ()=>{
            this.scene.start('stage1');
        });

        this.collision.setTileIndexCallback([47, 53],()=>{
            playerHp = 0;
        });

        this.collision.setTileIndexCallback([1, 2, 3, 4, 5, 7, 8, 9, 10, 13, 14, 15, 16],()=>{
            onIce = true;
            timerGlace = 5;
        });

        this.textJumping = this.add.text(16, 16, 'Jumping : ' + playerHp, { fontSize: '32px', fill: '#000' }).setScrollFactor(0);
    }

    update(){
        this.textJumping.setText('PlayerHp : ' + inputP[4]);

        let pad = Phaser.Input.Gamepad.Gamepad;
    
        if(this.input.gamepad.total){   //Si une manette est connecté
            pad = this.input.gamepad.getPad(0);  //pad récupère les inputs du joueur
            xAxis = pad ? pad.axes[0].getValue() : 0;   //Si le stick est utilisé xAxys récupère la valeur sur l'axe X, sinon il est égale a 0
            yAxis = pad ? pad.axes[1].getValue() : 0;   //Pareil pour l'axe Y
        }

        if(playerHp <=0){
            this.camera.shake(250, 0.02);
            this.player.visible = false;
            this.time.addEvent({ delay: 250, callback: function(){this.scene.start('stage2')
            playerHp = 3;}, callbackScope: this});
        }

        if (timerGlace > 0){
            timerGlace--
            if(timerGlace == 0){
                onIce = false
            }
        }

        if (this.player.body.velocity.x > 250){
            this.player.setVelocityX(250);
        }
        
        //Logic

        //Position de l'attaque
        if (attack){    //reposition de la hitbox quand le joueur attack
            this.hitbox.y = this.player.y+10;
            if (this.player.flipX){
                this.hitbox.x = this.player.x-134;
            }
    
            else{
                this.hitbox.x = this.player.x+6;
            }

            this.time.addEvent({ delay: 50, callback: function(){attack = false;}, callbackScope: this});

        }

        else{
            this.hitbox.y = -100;
        }


        //Le joueur appuie sur Droite(Clavier) ou pad Droite/stick vers la Droite(Manette)
        inputP[0] = this.cursors.right.isDown || pad.right || xAxis > 0.4 ? true : false;

        //Le joueur appuie sur Gauche(Clavier) ou pad gauche/stick vers la Gauche(Manette)
        inputP[1] = this.cursors.left.isDown || pad.left || xAxis < -0.4 ? true : false;

        //Le joueur appuie sur Bas(Clavier) ou pad Bas/stick vers la Bas(Manette)
        inputP[2] = this.cursors.down.isDown || pad.down || yAxis > 0.5 ? true : false;

        //Le joueur appuie sur Haut(Clavier) ou pad Haut/stick vers la Haut(Manette)
        if (this.cursors.space.isDown || pad.b){
            if (mana == 5){
                inputP[4] = true;
            }
        }

        if (this.cursors.a.isDown || pad.x){
            if (this.player.body.velocity.x == 0 && this.player.body.velocity.y == 0 && mana == 5){
                inputP[5] = true;
            }
        }
        
        if (this.cursors.up.isDown || pad.up || yAxis < -0.5){
            if(!jumping && jump>0){
                inputP[3] = true;
                jumping = true;
            }
        }

        else if(this.cursors.up.isUp){
            inputP[3] = false;
            jumping = false;
        }

        


        //Movement

        if (direction == "Jump"){
            direction = "Face"
            this.player.setVelocityY(-650);
            jump--;
        }
        

        if (inputP[0]){
            this.player.flipX = false;
            if(onIce){
                this.player.setAccelerationX(this.playerSpeedX);
            }

            else{
            this.player.setVelocityX(this.playerSpeedX);
            }

        }
        
        else if (inputP[1]){
            this.player.flipX = true;
            if(onIce){
                this.player.setAccelerationX(-this.playerSpeedX);
            }

            else{
            this.player.setVelocityX(-this.playerSpeedX);
            }
        }

        else {
            if (onIce){
                if(this.player.body.velocity.x < 0){
                    this.player.setAccelerationX(300);
                }
                
                else if(this.player.body.velocity.x > 0) {
                    this.player.setAccelerationX(-300);
                }
                
                
                else {
                    this.player.setVelocityX(0);
                    this.player.setAccelerationX(0);
                }
            }

            else {
                this.player.setVelocityX(0);
                this.player.setAccelerationX(0);
            }

        }

        if (direction == "Jump"){
            direction = "Face"
            this.player.setVelocityY(-650);
            jump--;
        }

        if (direction == "Laser"){
            attack = true;

            direction = "Face";
        }
        
        if (inputP[3] && jump > 0){
            jump--;
            this.player.setVelocityY(-this.playerSpeedY);
        }

        if(this.player.body.velocity.y == 0){
            jump = 1;
        }

        //Animation

        if (inputP[4]){
            this.player.anims.play('superJump', true);
            mana = 0;
            keyPush = "B";
        }

        else if (inputP[5]){
            this.player.setVelocityX(0);
            this.player.setVelocityY(-10);
            this.player.anims.play('laser', true);
            mana = 0;
            keyPush = "X";
        }

        else if (this.player.body.velocity.x != 0){
            this.player.anims.play('run', true)
        }

        else{
            this.player.anims.play('face', true)
        }


        //Life bar
        if(playerHp == 3){
            this.lifeBar.setFrame(0);
        }

        else if(playerHp == 2){
            this.lifeBar.setFrame(1);
        }

        else if(playerHp == 1){
            this.lifeBar.setFrame(2);
        }

        else{
            this.lifeBar.setFrame(3);
        }


        //Mana Bar
        if(mana == 5){
            this.manaBar.setFrame(5);
        }

        else if(mana == 4){
            this.manaBar.setFrame(4);
        }

        else if(mana == 3){
            this.manaBar.setFrame(3);
        }

        else if(mana == 2){
            this.manaBar.setFrame(2);
        }

        else if(mana == 1){
            this.manaBar.setFrame(1);
        }

        else{
            this.manaBar.setFrame(0)
        }

    }

}