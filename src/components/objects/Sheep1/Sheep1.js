import { Group, Vector3, AnimationMixer, Box3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './scene.gltf';
import { globals } from '../../../global';

class Sheep1 extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'sheep1';
        this.hitbox = new Box3()
        this.health = 1000;
        this.maxhealth = 1000;

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

        var newpos = this.position.clone().add(direction.normalize().multiplyScalar(0.08));

        // check if moving out of arena
        if (globals.arena.containsPoint(newpos) === false){
            direction.multiplyScalar(-1)
            this.position.add(direction.normalize().multiplyScalar(0.08));
            
            this.rotation.y +=  Math.PI;
        }

        
        else{
            this.position.add(direction.normalize().multiplyScalar(0.08));
        }

        this.hitbox.setFromCenterAndSize(this.position, this.scale.clone().multiplyScalar(1))
        this.hitbox.min.add(new Vector3(0, 1, 0).multiplyScalar(1.5))
        this.hitbox.max.add(new Vector3(0, 1, 0).multiplyScalar(1.5))
    }

    takeDamage(){
        this.health -= 1;
    }
}

export default Sheep1;
