import {Scene} from "phaser";
import { CONFIG } from "../config"
import Player from "../entities/Player";
import Touch from "../entities/Touch";
import Cow from "../entities/Cow";
import CowTwo from "../entities/CowTwo";

export default class SceneFarm extends Scene{

    /** @type {Phaser.Tilemaps.Tilemap} */
    map;

    layers = {};

    /** @type {Phaser} */
    player;
    touch;

    //** @type {Phaser.Physics.Arcade.Group} */
    groupObjects;
    objects;

    seedsTiled;
       

    //Variaveis de confirmação

    isTouching = false;
    regador =false;
    abobora =false;
    beringela =false;
    pepino =false;


    //Variaveis de sprite

    aboboraSprite;
    beringelaSprite;
    pepinoSprite;

    // Conferindo se cada semente foi plantada
    aboboraPlantando =false;
    beringelaPlatando =false;
    pepinoPlantando =false;

    //Conferindo se ja esta pronto para colher
    stateTreeMaca =0;
    stateTreeLaranja =0;
    statePlant = 0;
    colher = false;
    money = 0;
    
    constructor(){
        super('SceneFarm');
    }

    preload(){

        //Carregando os dados do mapa
        this.load.tilemapTiledJSON('tiliemap-farm-info', 'assets/mapas/farmMap.json')

        //Carregar os Tiles sets do mapa
        this.load.image('tiles-farm', 'assets/tiles/fazenda/geral.png')

        this.load.spritesheet('player', 'assets/mapas/coelho.png', {
            frameWidth: CONFIG.TILE_SIZE * 3,
            frameHeight: CONFIG.TILE_SIZE * 3
        });

        this.load.spritesheet('cow', 'assets/mapas/cowAnims.png', {
            frameWidth: CONFIG.TILE_SIZE * 2,
            frameHeight: CONFIG.TILE_SIZE * 2
        });
        this.load.spritesheet('geral_sprite', 'assets/tiles/fazenda/geral.png', {
            frameWidth: CONFIG.TILE_SIZE,
            frameHeight: CONFIG.TILE_SIZE 
        });

        this.load.spritesheet('arvore_laranja', 'assets/mapas/arvore_laranjas_anim.png', {
            frameWidth: CONFIG.TILE_SIZE*3,
            frameHeight: CONFIG.TILE_SIZE*3 
        });
        this.load.spritesheet('arvore_maca', 'assets/mapas/arvore_macas_anim.png', {
            frameWidth: CONFIG.TILE_SIZE*3,
            frameHeight: CONFIG.TILE_SIZE*3 
        });
        this.load.spritesheet('arvore', 'assets/mapas/arvore_anim.png', {
            frameWidth: CONFIG.TILE_SIZE*3,
            frameHeight: CONFIG.TILE_SIZE*3 
        });
        
    }
    
    create(){

        this.cursors = this.input.keyboard.createCursorKeys();

        this.createMap();
        this.createPlayer();
        this.createCow();
        this.createCowTwo();
        this.createLayers();
        this.createObjects();
        this.createColliders();    
        this.createCamera();
        this.openHouse();
        this.handleTouch();
        this.coleteTree()
    }
        
    
    update(){
        
    }

    createPlayer(){
        this.touch = new Touch(this, 250, 200);

        this.player =  new Player(this, 250, 200, this.touch);
        this.player.setDepth(3)

    }
    createCow(){
        this.cow =  new Cow(this, 300, 220, this.touch);
        this.cow.setDepth(3)

    }
    createCowTwo(){
        this.cowTwo =  new CowTwo(this, 220, 120, this.touch);
        this.cowTwo.setDepth(3)

    }

    createMap(){
        this.map = this.make.tilemap({
            key:'tiliemap-farm-info', //dados json 
            tileWidth: CONFIG.TILE_SIZE,
            tileHeight: CONFIG.TILE_SIZE
        });

        //fazendo a correnpodencia ente as imagens usada no Tiled e as carrregadas peli phaser
        // addTilesetImage(nome da imagem no Tiled, nome da imagem carregado no Phaser)
        this.map.addTilesetImage('geral', 'tiles-farm');
    }

    createObjects(){

        this.groupObjects =this.physics.add.group();

        const objects = this.map.createFromObjects('Objects','Objects',{
            nome: 'seeds', nome: 'doorHouse', nome: 'regador',nome: 'beringela', nome: 'pepino', nome: 'abobora', nome: 'coracao', nome: 'laranja'
        });
        
        this.physics.world.enable(objects);

        for ( let i = 0; i <objects.length; i++){
            const obj = objects[i]

            const prop = this.map.objects[0].objects[i]
            
            obj.setDepth(this.layers.length+1);
            obj.setVisible(false);

            this.groupObjects.add( obj);

        }

    }

    createLayers() {
        //pegando os tilessets (usar os nomes )
        const tilesFarm = this.map.getTileset('geral');

        const layerNames = this.map.getTileLayerNames();
        for (let i = 0; i < layerNames.length; i++) {
            const name = layerNames[i];
            

            // this.map.createLayer(name, [tilesFarm], 0, 0);           
            this.layers[name] = this.map.createLayer(name, [tilesFarm], 0, 0);
            //definindo a profundidade de cada camada
            this.layers[name].setDepth(i);

            //verifica se o layers possui uma colisão

            if(name.endsWith('Collision') ) {
                this.layers[name].setCollisionByProperty({collide: true});
                

                /* if ( CONFIG.DEBUG_COLLISION ) {
                    const debugGraphics = this.add.graphics().setAlpha(0.75).setDepth(i);
                    this.layers[name].renderDebug(debugGraphics, {
                        tileColor: null, // Color of non-colliding tiles
                        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
                        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
                    });

                } */

            }

        }

    }

    createColliders(){
        const layerNames = this.map.getTileLayerNames();
        for ( let i = 0; i < layerNames.length; i++){
            const name = layerNames[i];

            if (name.endsWith('Collision')) {
                this.physics.add.collider(this.player, this.layers[name]);
                this.physics.add.collider(this.cow, this.layers[name]);
                this.physics.add.collider(this.cowTwo, this.layers[name]);
            }
        }

        this.physics.add.overlap(this.touch, this.groupObjects, this.handleTouch, undefined, this);
        this.physics.add.overlap(this.touch, this.groupObjects, this.openHouse, undefined, this);
        this.physics.add.overlap(this.touch, this.groupObjects, this.coleteTree, undefined, this);
    }

    createCamera(){
        const mapWidth =this.map.width * CONFIG.TILE_SIZE;
        const mapHeight =this.map.height * CONFIG.TILE_SIZE;

        this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
        this.cameras.main.startFollow(this.player)
    }

    openHouse(touch, objects){ 
        const { space } = this.cursors;  
        if(space.isDown && objects.name =='doorHouse' && this.isTouching == false){
            this.scene.switch('SceneHouse');
        }
    }

    handleTouch(touch, objects){      
        const { space } = this.cursors;  
        // Pegando os objetos

        if(space.isDown && objects.name =='regador' && this.regador== false){
            this.regador = true;

            this.beringela = false; 
            this.abobora = false; 
            this.pepino = false; 
            console.log(this.regador)
        }
        if(space.isDown && objects.name =='beringela' && this.beringela== false){
            this.beringela = true;

            this.regador = false; 
            this.abobora = false; 
            this.pepino = false; 
            console.log(this.beringela)
        }
        if(space.isDown && objects.name =='pepino' && this.pepino== false){
            this.pepino = true;

            this.regador = false; 
            this.abobora = false; 
            this.beringela = false; 
            console.log(this.pepino)
        }
        if(space.isDown && objects.name =='abobora' && this.abobora== false){
            this.abobora = true;

            this.regador = false; 
            this.beringela = false; 
            this.pepino = false; 
            console.log(this.abobora)
        }

        

        //Interagindo com o terreno

        if(space.isDown && objects.name =='seeds' && this.abobora== true){
            const aboboraSprite = this.physics.add.sprite(objects.x, objects.y, 'geral_sprite')
            .setDepth(0)
            aboboraSprite.setFrame(752);
            this.aboboraPlantando = true;
            this.player.play('idle-space')
            this.statePlant = 0;
            console.log('plantando abobora')

        }


        if(space.isDown && objects.name =='seeds' && this.beringela== true){
            const beringelaSprite = this.physics.add.sprite(objects.x, objects.y, 'geral_sprite')
            beringelaSprite.setFrame(656)
            this.beringelaPlatando = true;
            this.player.play('idle-space')
            this.statePlant = 0;
            console.log('plantando beringela')
            
        }


        if(space.isDown && objects.name =='seeds' && this.pepino== true){
            const pepinoSprite = this.physics.add.sprite(objects.x, objects.y, 'geral_sprite')
            pepinoSprite.setFrame(872)
            this.pepinoPlantando = true;
            this.player.play('idle-space')
            this.statePlant = 0;
            console.log('plantando pepino')
        }



        ////Estados da semeente de Abobora

        if(space.isDown && objects.name =='seeds' && this.aboboraPlantando== true && this.regador ==true && this.statePlant == 0){
            const aboboraSprite = this.physics.add.sprite(objects.x, objects.y, 'geral_sprite')
            aboboraSprite.setFrame(752)
            .setDepth(0) 
            setTimeout(()=> {
                aboboraSprite.setFrame(753);
                this.statePlant = 1
            }, 3000)
            this.regador = false;
        }
        if(space.isDown && objects.name =='seeds' && this.aboboraPlantando== true && this.regador ==true && this.statePlant == 1){
            const aboboraSprite = this.physics.add.sprite(objects.x, objects.y, 'geral_sprite')
            aboboraSprite.setFrame(753)
            .setDepth(0) 
            setTimeout(()=> {
                aboboraSprite.setFrame(754);
                this.statePlant = 2
            }, 3000)
            this.regador = false;
        }
        if(space.isDown && objects.name =='seeds' && this.aboboraPlantando== true && this.regador ==true && this.statePlant == 2){
            const aboboraSprite = this.physics.add.sprite(objects.x, objects.y, 'geral_sprite')
            aboboraSprite.setFrame(754)
            .setDepth(0) 
            setTimeout(()=> {
                aboboraSprite.setFrame(755);
                this.statePlant = 3
            }, 3000)
            this.regador = false;
            this.colher =true
        }

        if(space.isDown && objects.name =='seeds' && this.aboboraPlantando== true && this.statePlant== 3){
            console.log('colheu')
            const aboboraSprite = this.physics.add.sprite(objects.x, objects.y, 'geral_sprite')
            aboboraSprite.setFrame(11)
            this.statePlant = 0
            this.aboboraPlantando= false
            this.colher = false;
        }



        //Estados da semeente de Beringela


        if(space.isDown && objects.name =='seeds' && this.beringelaPlatando== true && this.regador ==true && this.statePlant == 0){
            const beringelaSprite = this.physics.add.sprite(objects.x, objects.y, 'geral_sprite')
            beringelaSprite.setFrame(656)
            .setDepth(0)
            setTimeout(()=> {
                beringelaSprite.setFrame(657);
                this.statePlant = 1
            }, 3000)
            this.regador = false;   
        }
        if(space.isDown && objects.name =='seeds' && this.beringelaPlatando== true && this.regador ==true && this.statePlant == 1){
            const beringelaSprite = this.physics.add.sprite(objects.x, objects.y, 'geral_sprite')
            beringelaSprite.setFrame(657)
            .setDepth(0)
            setTimeout(()=> {
                beringelaSprite.setFrame(658);
                this.statePlant = 2
            }, 3000)
            this.regador = false;   
        }
        if(space.isDown && objects.name =='seeds' && this.beringelaPlatando== true && this.regador ==true && this.statePlant == 2){
            const beringelaSprite = this.physics.add.sprite(objects.x, objects.y, 'geral_sprite')
            beringelaSprite.setFrame(658)
            .setDepth(0)
            setTimeout(()=> {
                beringelaSprite.setFrame(659);
                this.statePlant = 3
            }, 3000)
            this.regador = false;   
            this.colher =true
        }
        if(space.isDown && objects.name =='seeds' && this.beringelaPlatando== true && this.statePlant== 3){
            console.log('colheu')
            const beringelaSprite = this.physics.add.sprite(objects.x, objects.y, 'geral_sprite')
            beringelaSprite.setFrame(11)
            this.statePlant = 0
            this.beringelaPlatando= false
            this.colher = false;
        }



        //Estados da semeente de Pepino

        if(space.isDown && objects.name =='seeds' && this.pepinoPlantando== true && this.regador ==true && this.statePlant == 0){
            const pepinoSprite = this.physics.add.sprite(objects.x, objects.y, 'geral_sprite')
            pepinoSprite.setFrame(872)
            .setDepth(0)
            setTimeout(()=> {
                pepinoSprite.setFrame(873);
                this.statePlant = 1
            }, 3000)
            this.regador = false;
        }
        if(space.isDown && objects.name =='seeds' && this.pepinoPlantando== true && this.regador ==true && this.statePlant == 1){
            const pepinoSprite = this.physics.add.sprite(objects.x, objects.y, 'geral_sprite')
            pepinoSprite.setFrame(873)
            .setDepth(0)
            setTimeout(()=> {
                pepinoSprite.setFrame(874);
                this.statePlant = 2
            }, 3000)
            this.regador = false;
        }
        if(space.isDown && objects.name =='seeds' && this.pepinoPlantando== true && this.regador ==true && this.statePlant == 2){
            const pepinoSprite = this.physics.add.sprite(objects.x, objects.y, 'geral_sprite')
            pepinoSprite.setFrame(874)
            .setDepth(0)
            setTimeout(()=> {
                pepinoSprite.setFrame(875);
                this.statePlant = 3
            }, 3000)
            this.regador = false;
            this.colher =true
        }

        if(space.isDown && objects.name =='seeds' && this.pepinoPlantando== true && this.statePlant== 3){
            console.log('colheu')
            const pepinoSprite = this.physics.add.sprite(objects.x, objects.y, 'geral_sprite')
            pepinoSprite.setFrame(11)
            this.statePlant = 0
            this.pepinoPlantando= false
            this.colher = false;
        }

    }


    coleteTree(touch, objects){
        const { space } = this.cursors;
    
        if(space.isDown && objects.name === 'coracao' && this.stateTreeMaca === 0){
            const arvoreMaca = this.physics.add.sprite(/* 320, 90 */objects.x,objects.y-12, 'arvore_maca')
            let frameMaca = 35
            setTimeout(()=>{
                function arvoreMacaTime() {
                    arvoreMaca.setFrame(frameMaca);
                    frameMaca++;
                    if (frameMaca <= 47) {
                        setTimeout(arvoreMacaTime, 50);
                    }    
                }
                arvoreMacaTime();
            },1000);


            // arvoreMaca.destroy()
            // arvoreMaca = this.physics.add.sprite(320, 90, 'arvore')
            // arvoreMaca.setFrame(1)
        }
    
        if(space.isDown && objects.name === 'laranja' && this.stateTreeLaranja === 0){
            const arvorelaranja = this.physics.add.sprite(288, 27, 'arvore_laranja' )
            let frameLaranja = 35
            setTimeout(()=>{
                function arvorelaranjaTime() {
                    arvorelaranja.setFrame(frameLaranja);
                    frameLaranja++;
                    if (frameLaranja <= 47) {
                        setTimeout(arvorelaranjaTime, 50);
                    }
                }
                arvorelaranjaTime()
            },1000);
            this.stateTreeLaranja = 1;

        } 
         
        
        if(space.isDown && objects.name === 'laranja' && this.stateTreeLaranja === 1){
            const arvorelaranja = this.physics.add.sprite(288, 27, 'arvore' )
            arvorelaranja.setFrame(1)
        }
        

        
        
    }
    
}


