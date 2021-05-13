import { Group, Vector3, Box3, Box3Helper } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './sheep.gltf';

class Sheep extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'sheep';
        this.health = 100;
        this.hitbox = new Box3()
        this.hitbox.min.sub(new Vector3(0, -1, 0).multiplyScalar(0.5))
        
        loader.load(MODEL, (gltf) => {
    
            gltf.scene.children[0].scale.multiplyScalar(0.0008)
            gltf.scene.children[0].position.y -= 2
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
        this.hitbox.setFromCenterAndSize(this.position, this.scale.clone().multiplyScalar(0.3))
        this.hitbox.min.sub(new Vector3(0, 1, 0).multiplyScalar(2))
        this.hitbox.max.sub(new Vector3(0, 1, 0).multiplyScalar(2))
    }

    takedamage(){
        this.health -= 10;
    }
}

export default Sheep;
