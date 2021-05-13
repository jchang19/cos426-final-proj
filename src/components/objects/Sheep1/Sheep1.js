import { Group, Vector3, AnimationMixer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './scene.gltf';
import { globals } from '../../../global';

class Sheep1 extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'sheep1';

        loader.load(MODEL, (gltf) => {
            
            var mixer = new AnimationMixer( gltf.scene );
            var action = mixer.clipAction( gltf.animations[ 0 ] );
            action.play();


            gltf.scene.children[0].scale.multiplyScalar(0.25)
            gltf.scene.children[0].position.y = -7;
            this.add(gltf.scene);
            globals.mixers.push(mixer);
        });
    }

    move() {

        let p = Math.random();
        var direction = new Vector3(0, 0, 1);

        if (p < 0.33){
            this.rotation.y -= 0.01
        }
        else if (p < 0.66){
            this.rotation.y += 0.01
        }
        
        direction.applyEuler(this.rotation)
        this.position.add(direction.normalize().multiplyScalar(0.01))
    }
}

export default Sheep1;
