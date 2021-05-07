import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './scene.gltf';

class Cowboy extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'cowboy';
        
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });

    }
}

export default Cowboy;
