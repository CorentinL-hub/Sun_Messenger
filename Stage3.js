class Stage3 extends Phaser.Scene {
    
    constructor(){
        super("stage3");
    }

    create(){
        this.control = this.scene.get('control');

        this.cursors = this.input.keyboard.addKeys({ 
            'up': Phaser.Input.Keyboard.KeyCodes.Z,
            'down': Phaser.Input.Keyboard.KeyCodes.S, 
            'left': Phaser.Input.Keyboard.KeyCodes.Q,
            'right': Phaser.Input.Keyboard.KeyCodes.D,
            'upd': Phaser.Input.Keyboard.KeyCodes.UP,
            'downd': Phaser.Input.Keyboard.KeyCodes.DOWN, 
            'leftd': Phaser.Input.Keyboard.KeyCodes.LEFT,
            'rightd': Phaser.Input.Keyboard.KeyCodes.RIGHT,
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
        this.energies = this.energy.create(112, 688, 'energy').body.setAllowGravity(false);
        this.energies = this.energy.create(240, 864, 'energy').body.setAllowGravity(false);
        this.energies = this.energy.create(304, 720, 'energy').body.setAllowGravity(false);
        this.energies = this.energy.create(419, 272, 'energy').body.setAllowGravity(false);
        this.energies = this.energy.create(433, 572, 'energy').body.setAllowGravity(false);
        this.energies = this.energy.create(559, 464, 'energy').body.setAllowGravity(false);
        this.energies = this.energy.create(753, 848, 'energy').body.setAllowGravity(false);
        this.energies = this.energy.create(1200, 432, 'energy').body.setAllowGravity(false);
        this.energies = this.energy.create(1363, 528, 'energy').body.setAllowGravity(false);
        this.energies = this.energy.create(1491, 560, 'energy').body.setAllowGravity(false);
        this.energies = this.energy.create(2381, 739, 'energy').body.setAllowGravity(false);
        this.energies = this.energy.create(2480, 1008, 'energy').body.setAllowGravity(false);
        this.energies = this.energy.create(2608, 1008, 'energy').body.setAllowGravity(false);
        this.energies = this.energy.create(2639, 560, 'energy').body.setAllowGravity(false);

        this.life = this.physics.add.group();
        this.lifes = this.life.create(208, 489, 'life').body.setAllowGravity(false);
        this.lifes = this.life.create(788, 240, 'life').body.setAllowGravity(false);
        this.lifes = this.life.create(1167, 976, 'life').body.setAllowGravity(false);
        this.lifes = this.life.create(1782, 564, 'life').body.setAllowGravity(false);

        this.legume = this.physics.add.image(655, 10, 'legume');
        this.fraise = this.physics.add.image(2640, 300, 'fraise');

        //Creation of ennemis
        this.ennemis = this.physics.add.group();
        this.cerise1 = new EnnemiCerise(this, 2382, 500, 'cerise');
        this.cerise1.body.setSize(63, 50).setOffset(0, 20);

        new EnnemiPoire(this, 786, 240, 'poire');
        new EnnemiPoire(this, 1902, 990, 'poire');
        new EnnemiPoire(this, 2257, 940, 'poire');

        //Creation of player
        this.player = this.physics.add.sprite(100, 1045, "player").setSize(12, 48).setOffset(16,20);
        this.playerSpeedX = 150;
        this.playerSpeedY = 320;

        this.hitbox = this.physics.add.image(this.player.x, this.player.y, 'attack').setOrigin(0, 0.5);
        this.hitbox.body.setAllowGravity(false);

        //Player
        this.physics.add.overlap(this.player, this.energy, this.getEnergy, null, this);
        this.physics.add.overlap(this.player, this.life, this.getLife, null, this);
        this.physics.add.overlap(this.player, this.legume, this.getLegume, null, this);
        this.physics.add.overlap(this.player, this.fraise, this.getFraise, null, this);
        this.physics.add.overlap(this.player, this.ennemis, this.hitEnnemi, null, this);
        this.physics.add.collider(this.player, this.collision);
        this.physics.add.collider(this.player, this.crystal);

        //Ennemi
        this.physics.add.collider(this.ennemis, this.collision);

        //Object
        this.physics.add.collider(this.legume, this.collision);
        this.physics.add.collider(this.fraise, this.collision);
        
        //Tilemap
        this.collision.setCollisionByProperty({collides:true});
        this.crystal.setCollisionByProperty({collides:true});

        this.camera = this.cameras.main.setSize(1600,900);
        this.camera.startFollow(this.player, true, 0.08, 0.08);
        this.camera.setBounds(32, 0, 2752, 1144);

        this.player.on('animationcomplete', function(){
            if(keyPush == "B"){
                direction = "Jump";
                inputP[4] = false;
                mana = 0;
            }

            if(keyPush == "X"){
                direction = "Laser";
                inputP[5] = false;
                mana = 0;
            }
        }, this);

        this.crystal.setTileIndexCallback([81, 92],()=>{
            playerHp = 0;
        });
    }

    update(){

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
        inputP[0] = this.cursors.right.isDown || this.cursors.rightd.isDown || pad.right || xAxis > 0.4 ? true : false;

        //Le joueur appuie sur Gauche(Clavier) ou pad gauche/stick vers la Gauche(Manette)
        inputP[1] = this.cursors.left.isDown || this.cursors.leftd.isDown || pad.left || xAxis < -0.4 ? true : false;

        //Le joueur appuie sur Bas(Clavier) ou pad Bas/stick vers la Bas(Manette)
        inputP[2] = this.cursors.down.isDown || this.cursors.downd.isDown || pad.down || yAxis > 0.5 ? true : false;

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
        
        if (this.cursors.up.isDown || this.cursors.upd.isDown || pad.up || yAxis < -0.5){
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

        if(this.player.body.blocked.down){
            jump = 1;
        }


        //Animation
        if (inputP[4]){
            this.player.anims.play('superJump', true);
            this.player.setVelocityY(-10);
            keyPush = "B";
        }

        else if (inputP[5]){
            this.player.setVelocityX(0);
            this.player.setVelocityY(-10);
            this.player.anims.play('laser', true);
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

    getFraise(player, fraise){
        fraise.destroy();
        this.scene.start('sceneFin');
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