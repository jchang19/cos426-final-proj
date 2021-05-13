import { Group, Vector3, Box3} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './wolf.gltf';
import { globals } from '../../../global';

class Wolf extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'wolf';
        this.hitbox = new Box3()

        loader.load(MODEL, (gltf) => {
    
            // console.log(gltf)
            gltf.scene.children[0].scale.multiplyScalar(0.1)
            this.add(gltf.scene);
        });

        let x = Math.random() * 20 - 10
        let z = Math.random() * 20 - 10

        this.position.x = x
        this.position.z = z
        this.position.y -= 2.5
    }

    move() {
        var direction = globals.sheep.position.clone().sub(this.position).normalize();
        let angle = new Vector3(0, 0, 1).angleTo(direction);
        if (globals.sheep.position.x - this.position.x < 0) {
            angle = Math.PI * 2 - angle;
        }

        this.rotation.y = angle

        this.position.add(direction.normalize().multiplyScalar(0.01))
        this.position.y =  -2.5

        // Update hitbox
        this.hitbox.setFromCenterAndSize(this.position, this.scale.clone().multiplyScalar(0.5))
        this.hitbox.min.add(new Vector3(0, 1, 0).multiplyScalar(0.3))
        this.hitbox.max.add(new Vector3(0, 1, 0).multiplyScalar(0.3))
    }
}

export default Wolf;