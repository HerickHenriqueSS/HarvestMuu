import { CONFIG } from "../config";
import SceneFarm from "../scene/SceneFarm";

export default class Cow extends Phaser.Physics.Arcade.Sprite {
    /** @type {Phaser.Type.Input.Keyboard.CursorKeys} */

    cursors;

    isAction = false;   // Diz se a tecla espaço( de ação ) esta precionada

    constructor(scene, x, y, touch){
        super(scene, x, y, 'cow')

        scene.add.existing(this);         // Criando a imagem que o jogador ve
        scene.physics.add.existing(this); // Criando o Body da Fisica

        this.init();
    }

    init() {
        this.setFrame(7);

        this.speed =5;
        this.frameRate =8;
        this.direction = 'down';

        this.body.setSize(16, 16);
        this.body.setOffset(8, 12);
        this.initAnimations();

        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);

        this.play('stoped')

        setInterval(() => {
        
            var randomNumber = Math.floor(Math.random()*4)
            if( randomNumber == 0){
                this.setVelocityX(7);
                this.setVelocityY(0);
                this.play('walk')
                this.flipX = false;
                
            }
            if( randomNumber == 1){
                this.setVelocityX(-7); 
                this.setVelocityY(0);
                this.play('walk')
                this.flipX = true;
                
            }
            if( randomNumber == 2){
                this.setVelocityX(0);
                this.setVelocityY(7);
                this.play('walk')
                
            }
            if( randomNumber == 3){
                this.setVelocityX(0);
                this.setVelocityY(-7);
                this.play('walk')
                
            }
            
        }, 4000);
    
    
        setInterval(() => {
            if(this.body.velocity.x == 0 && this.body.velocity.y == 0){
                this.play('stoped')
                
            }
        }, 1000)
              
        
        
    }

    update(){
        
    }
    

    initAnimations(){
        //Idle
        this.anims.create({
            key: 'stoped',
            frames: this.anims.generateFrameNumbers('cow', {
            start: 18, end: 19}),
            frameRate: this.frameRate,
            repeat: 0
        });
        

        //Walking cow
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('cow', {
            start: 10, end: 16}),
            frameRate: this.frameRate,
            repeat: -1
        });
        
    }

    

    
}
