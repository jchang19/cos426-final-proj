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

            this.scale.multiplyScalar(2.5);
            var max_x = 200;
            var min_x = 70;
            var max_z = 200;
            var min_z = 30;
            let x = Math.random() * (max_x - min_x) + min_x;
            let z = Math.random() * (max_z - min_z) + min_z;

            this.position.x = x;
            this.position.z = z;
            this.position.y = -45;
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
