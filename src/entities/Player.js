import { CONFIG } from "../config";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    /** @type {Phaser.Type.Input.Keyboard.CursorKeys} */

    cursors;

    isAction = false;   // Diz se a tecla espaço( de ação ) esta precionada

    constructor(scene, x, y, touch){
        super(scene, x, y, 'player')

        this.touch = touch;

        scene.add.existing(this);         // Criando a imagem que o jogador ve
        scene.physics.add.existing(this); // Criando o Body da Fisica

        this.init();
    }

    init() {
        this.setFrame(7);

        this.speed =120;
        this.frameRate =8;
        this.direction = 'down';
        this.cursors = this.scene.input.keyboard.createCursorKeys();

        this.body.setSize(14, 16);
        this.body.setOffset(17, 15);
        this.initAnimations();

        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);

        this.play('idle-up')
    }

    update(){
        const{ left, right, down, up, space} = this.cursors;

        if (left.isDown) {
            this.direction = 'left'
            this.setVelocityX(-this.speed);
        }else if (right.isDown){
            this.direction = 'right'
            this.setVelocityX(this.speed);
        }else{
            this.setVelocityX(0);
        }
        if (up.isDown) {
            this.direction = 'up'
            this.setVelocityY(-this.speed);
        }else if (down.isDown){
            this.direction = 'down'
            this.setVelocityY(this.speed);
        }else{
            this.setVelocityY(0);
        }
        if( space.isDown){
            this.isAction = true;
        }else{
            this.isAction = false;
        }

        //Parou de andar
        if ( this.body.velocity.x === 0 && this.body.velocity.y === 0 ){
            this.play('idle-' + this.direction, true);
        }else {
            this.play('walk-' + this.direction, true);
        }

        //Fazer o touch seguir o player
        let tx, ty;
        let distance = 16;

        switch(this.direction) {
            case 'down':
                tx = -8;
                ty = distance - CONFIG.TILE_SIZE/2.8;
                break;

            case 'up':
                tx = -8;
                ty = - distance + CONFIG.TILE_SIZE/3;
                break;

            case 'right':
                tx = distance /8;
                ty = CONFIG.TILE_SIZE/5;
                break;

            case 'left':
                tx = -distance-2;
                ty = CONFIG.TILE_SIZE/5;
                break;

            case 'space':
                tx = 0;
                ty = 0;
                break;
        }
        this.touch.setPosition(this.x + tx + CONFIG.TILE_SIZE/2, this.y + ty);

    }

    initAnimations(){
        //Idle
        this.anims.create({
            key: 'idle-right',
            frames: this.anims.generateFrameNumbers('player', {
            start: 24, end: 31}),
            frameRate: this.frameRate,
            repeat: -1
        });
        this.anims.create({
            key: 'idle-up',
            frames: this.anims.generateFrameNumbers('player', {
            start: 8, end: 15}),
            frameRate: this.frameRate,
            repeat: -1
        });
        this.anims.create({
            key: 'idle-left',
            frames: this.anims.generateFrameNumbers('player', {
            start: 16, end: 23}),
            frameRate: this.frameRate,
            repeat: -1
        });
        this.anims.create({
            key: 'idle-down',
            frames: this.anims.generateFrameNumbers('player', {
            start: 0, end: 7}),
            frameRate: this.frameRate,
            repeat: -1
        });
        this.anims.create({
            key: 'idle-space',
            frames: this.anims.generateFrameNumbers('player', {
            start: 104, end: 111}),
            frameRate: this.frameRate,
            repeat: 0
        });

        //Walking player
        this.anims.create({
            key: 'walk-right',
            frames: this.anims.generateFrameNumbers('player', {
            start: 48, end: 55}),
            frameRate: this.frameRate,
            repeat: -1
        });
        this.anims.create({
            key: 'walk-up',
            frames: this.anims.generateFrameNumbers('player', {
            start: 40, end: 47}),
            frameRate: this.frameRate,
            repeat: -1
        });
        this.anims.create({
            key: 'walk-left',
            frames: this.anims.generateFrameNumbers('player', {
            start: 56, end: 63}),
            frameRate: this.frameRate,
            repeat: -1
        });
        this.anims.create({
            key: 'walk-down',
            frames: this.anims.generateFrameNumbers('player', {
            start: 32, end: 39}),
            frameRate: this.frameRate,
            repeat: -1
        });
        
        
    }
}