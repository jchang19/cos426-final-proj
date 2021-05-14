import { Group, Vector3, AnimationMixer, Box3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './scene.gltf';
import { globals } from '../../../global';

class Wolf1 extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'wolf1';
        this.hitbox = new Box3()
        this.health = 100

        loader.load(MODEL, (gltf) => {
            
            var mixer = new AnimationMixer( gltf.scene );
            var action = mixer.clipAction( gltf.animations[ 0 ] );
            action.play();

            //gltf.scene.children[0].scale.multiplyScalar(0.1)
            this.add(gltf.scene);
            globals.mixers.push(mixer);
        });

        var max_x = 200;
        var min_x = 70;
        var max_z = 200;
        var min_z = 30;
        let x = Math.random() * (max_x - min_x) + min_x;
        let z = Math.random() * (max_z - min_z) + min_z;

        this.position.x = x;
        this.position.z = z;
        this.position.y = -45;
    }

    move() {
        var direction = globals.sheep.position.clone().sub(this.position).normalize();
        let angle = new Vector3(0, 0, 1).angleTo(direction);
        if (globals.sheep.position.x - this.position.x < 0) {
            angle = Math.PI * 2 - angle;
        }

        this.rotation.y = angle;

        var newpos = this.position.clone().add(direction.normalize().multiplyScalar(0.08));

        // check if moving out of arena
        if (globals.arena.containsPoint(newpos) === false){
            direction.multiplyScalar(-1)
            this.position.add(direction.normalize().multiplyScalar(0.08));
        }
        else{
            this.position.add(direction.normalize().multiplyScalar(0.08));
        }

        this.position.y =  -45;

        // Update hitbox
        this.hitbox.setFromCenterAndSize(this.position, this.scale.clone().multiplyScalar(0.9))
        this.hitbox.min.add(new Vector3(0, 1, 0).multiplyScalar(1.5))
        this.hitbox.max.add(new Vector3(0, 1, 0).multiplyScalar(1.5))

        this.hitbox.min.add(direction.clone().multiplyScalar(25))
        this.hitbox.max.add(direction.clone().multiplyScalar(25))
    }

    takeDamage(){
        this.health -= 50
    }
}

export default Wolf1;