import { AUTO } from "phaser";
import { CONFIG } from "./src/config";
import SceneFarm from "./src/scene/SceneFarm";
import SceneHouse from "./src/scene/SceneHouse";

const config = {
  width: CONFIG.GAME_WIDTH,
  height: CONFIG.GAME_HEIGHT,
  type: AUTO,
  scene: [SceneFarm, SceneHouse],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 0
      },
      debug: true
    }
  },
  pixelArt: true,
  scale: {
    zoom: CONFIG.GAME_SCALE
  }
}

export default new Phaser.Game(config);
