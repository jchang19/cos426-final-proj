import { Group, AnimationMixer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './scene.gltf';
import { globals } from '../../../global';

class Cactus extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'cactus';
        
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });

    }
}

export default Cactus;
