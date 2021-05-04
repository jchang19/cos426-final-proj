import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './sheep.gltf';

class Sheep extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'sheep';

        loader.load(MODEL, (gltf) => {
    
            console.log(gltf)
            gltf.scene.children[0].scale.multiplyScalar(0.008)
            this.add(gltf.scene);
        });
    }
}

export default Sheep;
