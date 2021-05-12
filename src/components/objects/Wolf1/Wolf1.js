import { Group, Vector3, AnimationMixer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './scene.gltf';
import { globals } from '../../../global';

class Wolf1 extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'wolf1';
        loader.load(MODEL, (gltf) => {
            
            var mixer = new AnimationMixer( gltf.scene );
            var action = mixer.clipAction( gltf.animations[ 0 ] );
            action.play();

            //gltf.scene.children[0].scale.multiplyScalar(0.1)
            this.add(gltf.scene);
            globals.mixers.push(mixer);
        });

        let x = Math.random() * 20 - 10
        let z = Math.random() * 20 - 10

        this.position.x = x
        this.position.z = z
        this.position.y -= 2.5
    }

    move() {
        var direction = globals.sheeps[0].position.clone().sub(this.position).normalize();
        let angle = new Vector3(0, 0, 1).angleTo(direction);
        if (globals.sheeps[0].position.x - this.position.x < 0) {
            angle = Math.PI * 2 - angle;
        }

        this.rotation.y = angle

        this.position.add(direction.normalize().multiplyScalar(0.01))
        this.position.y =  -2.5
    }
}

export default Wolf1;