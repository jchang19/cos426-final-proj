import { Group, AnimationMixer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './scene.gltf';
import { globals } from '../../../global';

class Barn extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'barn';
        
        loader.load(MODEL, (gltf) => {
            var mixer = new AnimationMixer( gltf.scene );
            var action = mixer.clipAction( gltf.animations[ 0 ] );
            action.play();

            //gltf.scene.children[0].scale.multiplyScalar(0.1)
            this.add(gltf.scene);
            globals.mixers.push(mixer);
        });

    }
}

export default Barn;
