import {Scene} from 'phaser';
import { CONFIG } from '../config';
import Touch from '../entities/Touch';
import Player from '../entities/Player';
import Cow from '../entities/Cow';

export default class SceneHouse extends Scene{
    /** @type {Phaser.Tilemaps.Tilemap} */
    map;

    layers = {};

    /** @type {Phaser} */
    player;
    touch;

    //** @type {Phaser.Physics.Arcade.Group} */
    groupObjects;

    isTouching = false;

    constructor(){
        super('SceneHouse');
    }

    preload(){
        //Carregando os dados do mapa
        this.load.tilemapTiledJSON('tiliemap-house-info', 'assets/mapaHouse/mapHouse.json')

        //Carregar os Tiles sets do mapa
        this.load.image('tiles-house', 'assets/tiles/fazenda/geral.png')

        this.load.spritesheet('player', 'assets/mapas/coelho.png', {
            frameWidth: CONFIG.TILE_SIZE * 3,
            frameHeight: CONFIG.TILE_SIZE * 3
        });
    }

    create(){

        this.cursors = this.input.keyboard.createCursorKeys();

        this.createMap();
        this.createPlayer();
        this.createLayers();
        this.createObjects()
        this.createColliders();
        this.createCamera();
        this.handleTouch();
    }

    update(){
        
        
    }

    createPlayer(){
        this.touch = new Touch(this, 250, 200);

        this.player =  new Player(this, 88, 325, this.touch);
        this.player.setDepth(3)

    }

    createMap(){
        this.map = this.make.tilemap({
            key:'tiliemap-house-info', //dados json 
            tileWidth: CONFIG.TILE_SIZE,
            tileHeight: CONFIG.TILE_SIZE
        });

        this.map.addTilesetImage('geral', 'tiles-house');
    }

    createLayers() {
        //pegando os tilessets (usar os nomes )
        const tilesHouse = this.map.getTileset('geral');

        const layerNames = this.map.getTileLayerNames();
        for (let i = 0; i < layerNames.length; i++) {
            const name = layerNames[i];
            

            // this.map.createLayer(name, [tilesHouse], 0, 0);           
            this.layers[name] = this.map.createLayer(name, [tilesHouse], 0, 0);
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

    createObjects(){

        this.groupObjects =this.physics.add.group();

        const objects = this.map.createFromObjects('Objects',{
            nome: 'door'
        
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

    createColliders(){
        const layerNames = this.map.getTileLayerNames();
        for ( let i = 0; i < layerNames.length; i++){
            const name = layerNames[i];

            if (name.endsWith('Collision')) {
                this.physics.add.collider(this.player, this.layers[name]);
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
        if(space.isDown && objects.name =='door' && this.isTouching == false){
            this.scene.switch('SceneFarm');
        }
    }

}