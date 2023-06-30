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
        // this.createCow();
        this.createLayers();
        this.createColliders();
        this.createCamera();
    }

    update(){
        
        
    }

    createPlayer(){
        this.touch = new Touch(this, 250, 200);

        this.player =  new Player(this, 250, 200, this.touch);
        this.player.setDepth(2)

    }
    createCow(){
        this.cow =  new Cow(this, 270, 200, this.touch);
        this.cow.setDepth(3)

    }

    createMap(){
        this.map = this.make.tilemap({
            key:'tiliemap-house-info', //dados json 
            tileWidth: CONFIG.TILE_SIZE,
            tileHeight: CONFIG.TILE_SIZE
        });

        //fazendo a correnpodencia ente as imagens usada no Tiled e as carrregadas peli phaser
        // addTilesetImage(nome da imagem no Tiled, nome da imagem carregado no Phaser)
        this.map.addTilesetImage('geral', 'tiles-house');
    }

    createLayers() {
        //pegando os tilessets (usar os nomes )
        const tilesHouse = this.map.getTileset('geral');

        const layerNames = this.map.getTileLayerNames();
        console.log(layerNames)
        for (let i = 0; i < layerNames.length; i++) {
            const name = layerNames[i];
            

            // this.map.createLayer(name, [tilesHouse], 0, 0);           
            this.layers[name] = this.map.createLayer(name, [tilesHouse], 0, 0);
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
                // this.physics.add.collider(this.cow, this.layers[name]);
                // this.physics.add.collider(this.cowTwo, this.layers[name]);
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

}