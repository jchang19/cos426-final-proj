import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './scene.gltf';

class S_Mountains extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 's_mountains';
        
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });

    }
}

export default S_Mountains;
