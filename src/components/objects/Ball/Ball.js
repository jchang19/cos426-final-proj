import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './scene.gltf';

class Ball extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'ball';
        
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });

    }
}

export default Ball;
