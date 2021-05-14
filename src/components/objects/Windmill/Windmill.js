import { Group, AnimationMixer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './scene.gltf';
import { globals } from '../../../global';

class Windmill extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'windmill';
        
        loader.load(MODEL, (gltf) => {
            var mixer = new AnimationMixer(gltf.scene);
            var action = mixer.clipAction(gltf.animations[ 0 ]);
            action.play();

            this.add(gltf.scene);
            globals.mixers.push(mixer);
        });
    }
}

export default Windmill;
