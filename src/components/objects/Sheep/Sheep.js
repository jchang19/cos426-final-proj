import { Group, Vector3 } from 'three';
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

    move() {

        let p = Math.random();
        var direction = new Vector3(0, 0, 1);

        if (p < 0.33){
            this.rotation.y -= 0.1
        }
        else if (p < 0.66){
            this.rotation.y += 0.1
        }
        
        direction.applyEuler(this.rotation)
        this.position.add(direction.normalize().multiplyScalar(0.01))
    }
}

export default Sheep;
