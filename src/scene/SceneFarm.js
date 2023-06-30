import {Scene} from "phaser";
import { CONFIG } from "../config"
import Player from "../entities/Player";
import Touch from "../entities/Touch";
import Cow from "../entities/Cow";

export default class SceneFarm extends Scene{

    /** @type {Phaser.Tilemaps.Tilemap} */
    map;

    layers = {};

    /** @type {Phaser} */
    player;
    touch;

    //** @type {Phaser.Physics.Arcade.Group} */
    groupObjects;

    seedsTiled;

    isTouching = false;
    regador =false;
    abobora =false;
    beringela =false;
    pepino =false;

    aboboraPlantando =false;
    beringelaPlatando =false;
    pepinoPlantando =false;
       
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
        this.handleTouch();
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
        this.cowTwo =  new Cow(this, 220, 120, this.touch);
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
            nome: 'seeds', nome: 'doorHouse', nome: 'regador',nome: 'beringela', nome: 'pepino', nome: 'abobora'
        
        });
        
        this.physics.world.enable(objects);

        for ( let i = 0; i <objects.length; i++){
            const obj = objects[i]
            //console.log(obj);

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
                console.log(name)

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
    }

    createCamera(){
        const mapWidth =this.map.width * CONFIG.TILE_SIZE;
        const mapHeight =this.map.height * CONFIG.TILE_SIZE;

        this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
        this.cameras.main.startFollow(this.player)
    }

    handleTouch(touch, objects){      
        
        const { space } = this.cursors;  
        if(space.isDown && objects.name =='doorHouse' && this.isTouching == false){
            this.isTouching = true;
            console.log('abril a porta')
            this.scene.switch('SceneHouse');
        }

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
            console.log('plantando abobora')

        }


        if(space.isDown && objects.name =='seeds' && this.beringela== true){
            const beringelaSprite = this.physics.add.sprite(objects.x, objects.y, 'geral_sprite')
            beringelaSprite.setFrame(656)
            this.beringelaPlatando = true;
            console.log('plantando beringela')
        }


        if(space.isDown && objects.name =='seeds' && this.pepino== true){
            const pepinoSprite = this.physics.add.sprite(objects.x, objects.y, 'geral_sprite')
            pepinoSprite.setFrame(872)
            this.pepinoPlantando = true;
            console.log('plantando pepino')
        }



        //Regando as plantas

        if(space.isDown && objects.name =='seeds' && this.aboboraPlantando== true && this.regador ==true){
            const aboboraSprite = this.physics.add.sprite(objects.x, objects.y, 'geral_sprite')
            .setDepth(0) 
            
            let frame = 753;

            function tempoDeCrescimento() {
                aboboraSprite.setFrame(frame);
                frame++;

                if (frame <= 755) {
                    setTimeout(tempoDeCrescimento, 2000); // Agendar o próximo ciclo após 2 segundos (2000 ms)
                }
            }

            tempoDeCrescimento();
                
        }

        if(space.isDown && objects.name =='seeds' && this.beringelaPlatando== true && this.regador ==true){
            const beringelaSprite = this.physics.add.sprite(objects.x, objects.y, 'geral_sprite')
            .setDepth(0) 
            let frame = 656;

            function tempoDeCrescimento() {
                beringelaSprite.setFrame(frame);
                frame++;

                if (frame <= 659) {
                    setTimeout(tempoDeCrescimento, 2000); // Agendar o próximo ciclo após 2 segundos (2000 ms)
                }
            }

            tempoDeCrescimento();
             
            
            
        }

        if(space.isDown && objects.name =='seeds' && this.pepinoPlantando== true && this.regador ==true){
            const pepinoSprite = this.physics.add.sprite(objects.x, objects.y, 'geral_sprite')
            .setDepth(0) 
            let frame = 872;

            function tempoDeCrescimento() {
                pepinoSprite.setFrame(frame);
                frame++;

                if (frame <= 875) {
                    setTimeout(tempoDeCrescimento, 2000); // Agendar o próximo ciclo após 2 segundos (2000 ms)
                }
            }

            tempoDeCrescimento();
             
            
            
        }

    }

    
    
    
}


