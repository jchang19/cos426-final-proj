import { Group, Vector3, AnimationMixer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './scene.gltf';
import { globals } from '../../../global';

class Phoenix extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'phoenix';
        loader.load(MODEL, (gltf) => {
            
            var mixer = new AnimationMixer( gltf.scene );
            var action = mixer.clipAction( gltf.animations[ 0 ] );
            action.play();

            //gltf.scene.children[0].scale.multiplyScalar(0.1)
            this.add(gltf.scene);
            globals.mixers.push(mixer);
        });
    }

    move() {
        
        var x = this.position.x;
        var y = this.position.y;
        var z = this.position.z;
        
        if (y < 400 ) {
            this.position.y += 0.15;
        }

        if (x>1000) {
            this.position.set(30, 200,500);
        }

        var direction = new Vector3(1,0,0);
        this.position.add(direction.multiplyScalar(3));
    }
}

export default Phoenix;