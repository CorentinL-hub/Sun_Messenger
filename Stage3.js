class Stage3 extends Phaser.Scene {
    
    constructor(){
        super("stage3");
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

        this.add.image(800, 450, "background").setScrollFactor(0.05,0);
        this.map = this.make.tilemap({ key: "stage3" });
        this.tileset = this.map.addTilesetImage("Tileset2", "tileset2");

        this.collision = this.map.createLayer("collision", this.tileset, 0, 0);
        this.crystal = this.map.createLayer("crystal", this.tileset, 0, 0);

        this.manaBar = this.add.sprite(50, 300, "manaBar").setScrollFactor(0);
        this.lifeBar = this.add.sprite(50, 100, "lifeBar").setScrollFactor(0);
        this.legumeCounter = this.add.sprite(1500, 100, "legumeCounter").setScrollFactor(0);

        this.energy = this.physics.add.group();
        this.energies = this.energy.create(80, 624, 'energy').body.setAllowGravity(false);
        this.energies = this.energy.create(208, 800, 'energy').body.setAllowGravity(false);
        this.energies = this.energy.create(272, 656, 'energy').body.setAllowGravity(false);
        this.energies = this.energy.create(387, 208, 'energy').body.setAllowGravity(false);
        this.energies = this.energy.create(401, 528, 'energy').body.setAllowGravity(false);
        this.energies = this.energy.create(527, 400, 'energy').body.setAllowGravity(false);
        this.energies = this.energy.create(721, 784, 'energy').body.setAllowGravity(false);
        this.energies = this.energy.create(1172, 368, 'energy').body.setAllowGravity(false);
        this.energies = this.energy.create(1331, 464, 'energy').body.setAllowGravity(false);
        this.energies = this.energy.create(1459, 496, 'energy').body.setAllowGravity(false);
        this.energies = this.energy.create(2349, 675, 'energy').body.setAllowGravity(false);
        this.energies = this.energy.create(2448, 944, 'energy').body.setAllowGravity(false);
        this.energies = this.energy.create(2576, 944, 'energy').body.setAllowGravity(false);
        this.energies = this.energy.create(2607, 496, 'energy').body.setAllowGravity(false);

        this.life = this.physics.add.group();
        this.lifes = this.life.create(176, 425, 'life').body.setAllowGravity(false);
        this.lifes = this.life.create(756, 176, 'life').body.setAllowGravity(false);
        this.lifes = this.life.create(1135, 912, 'life').body.setAllowGravity(false);
        this.lifes = this.life.create(1750, 500, 'life').body.setAllowGravity(false);

        this.legume = this.physics.add.image(623, 10, 'legume');

        //Creation of ennemis
        this.ennemis = this.physics.add.group();
        this.cerise1 = new EnnemiCerise(this, 2349, 500, 'cerise');
        this.cerise1.body.setSize(63, 50).setOffset(0, 20);

        new EnnemiPoire(this, 754, 200, 'poire');
        new EnnemiPoire(this, 1870, 990, 'poire');
        new EnnemiPoire(this, 2225, 940, 'poire');

        //Creation of player
        this.player = this.physics.add.sprite(100, 975, "player").setSize(12, 48).setOffset(16,20);
        this.player.setCollideWorldBounds(true);
        this.playerSpeedX = 150;
        this.playerSpeedY = 320;

        this.hitbox = this.physics.add.image(this.player.x, this.player.y, 'attack').setOrigin(0, 0.5);
        this.hitbox.body.setAllowGravity(false);

        //Player
        this.physics.add.overlap(this.player, this.energy, this.getEnergy, null, this);
        this.physics.add.overlap(this.player, this.life, this.getLife, null, this);
        this.physics.add.overlap(this.player, this.legume, this.getLegume, null, this);
        this.physics.add.overlap(this.player, this.ennemis, this.hitEnnemi, null, this);
        this.physics.add.collider(this.player, this.collision);
        this.physics.add.collider(this.player, this.crystal);

        //Ennemi
        this.physics.add.collider(this.ennemis, this.collision);
        this.physics.add.collider(this.legume, this.collision);
        
        //Tilemap
        this.collision.setCollisionByProperty({collides:true});
        this.crystal.setCollisionByProperty({collides:true});

        this.camera = this.cameras.main.setSize(1600,900);
        this.camera.startFollow(this.player, true, 0.08, 0.08);
        this.camera.setBounds(0, 0, 2752, 1080);

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

        this.collision.setTileLocationCallback(81, 11, 1, 2, ()=>{
            this.scene.start('menu');
            invulnerable = false;
        });

        this.crystal.setTileIndexCallback([81, 92],()=>{
            playerHp = 0;
        });
        this.textJumping = this.add.text(16, 16, 'Jumping : ' + playerHp, { fontSize: '32px', fill: '#000' }).setScrollFactor(0);
    }

    update(){
        this.textJumping.setText('X : ' + this.player.body.x + ' Y :' + this.player.body.y);

        let pad = Phaser.Input.Gamepad.Gamepad;

    
        if(this.input.gamepad.total){   //Si une manette est connecté
            pad = this.input.gamepad.getPad(0);  //pad récupère les inputs du joueur
            xAxis = pad ? pad.axes[0].getValue() : 0;   //Si le stick est utilisé xAxys récupère la valeur sur l'axe X, sinon il est égale a 0
            yAxis = pad ? pad.axes[1].getValue() : 0;   //Pareil pour l'axe Y
        }

        if(playerHp <=0){
            this.camera.shake(250, 0.02);
            this.player.visible = false;
            invulnerable = false;
            this.time.addEvent({ delay: 250, callback: function(){this.scene.start('stage3')
            playerHp = 3;}, callbackScope: this});
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

        if (direction == "Laser"){
            attack = true;

            direction = "Face";
        }
        
        if (inputP[0]){
            this.player.flipX = false;
            this.player.setVelocityX(this.playerSpeedX);
        }
        
        if (inputP[1]){
            this.player.flipX = true;
            this.player.setVelocityX(-this.playerSpeedX);
        }

        if (!inputP[0] && !inputP[1]){
            this.player.setVelocityX(0);
        }

        if (inputP[0] && inputP[1]){
            this.player.setVelocityX(0);
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
            this.player.setVelocityY(-10);
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

        //Monster's IA
        for(var i = 0; i < this.ennemis.getChildren().length; i++){
            let ennemis = this.ennemis.getChildren()[i];
            ennemis.ia(this.player);
        }


    }

    getEnergy(player, energy){
        if(mana<5){
            energy.destroy();
            mana++;
        }
    }

    getLife(player, life){
        if (playerHp < 3){
            playerHp++;
            life.destroy();
        }
    }

    getLegume(player, legume){
        legume.destroy();
        this.legumeCounter.setFrame(1);
    }


    destroy(projectile, other){
        projectile.destroy();
    }

    hitEnnemi(player, ennemis){
        if(!invulnerable)   // Si le joueur n'est pas invulnerable
        {
            playerHp --;                    // Le joueur perd un pv
            invulnerable = true;            // Il deviens invulnerable
            this.timer = this.time.addEvent({ delay: 2000, callback: function(){invulnerable = false;}, callbackScope: this});  // Le joueur n'est plus invulnerable après 2000ms

            if (playerHp > 0){  // Si le joueur est encore en vie après s'être pris le coup
                this.time.addEvent({ delay: 200, repeat: 9, callback: function(){player.visible = !player.visible;}, callbackScope: this}); // Le joueur passe de visible a non visible toutes les 200ms 9 fois de suite
            }

        }
    }

  
}