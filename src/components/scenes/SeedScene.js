import { Scene, Color, Vector3, Box3, Box3Helper, Clock } from 'three';
import { Sheep1, Desert, Bordered_Mountains, S_Mountains, Gun, Cowboy, Ball, Wolf1, Phoenix, Birds, Barn, Cactus, Windmill, Pointer} from 'objects';
import * as THREE from 'three';
import { BasicLights } from 'lights';
import { globals } from '../../global';
import { HurtWolf } from '../../audio';

const BULLETSPEED = 1;
const BULLETLIFESPAN = 5;

var wolfhurt = new Audio(HurtWolf);

class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            rotationSpeed: 0,
            updateList: [],
        };

        // Set background to a nice color
        this.background = new Color(0xA9DEF9);

        // Add meshes to scene
        const lights = new BasicLights();

        // add striking moutains to the scene as a default
        const s_mountains = new S_Mountains(this);
        s_mountains.position.set(0,0,0);
        s_mountains.scale.multiplyScalar(10);
        s_mountains.scale.y *= 0.5;
        this.add(s_mountains, lights);

        // Add Phoenix
        const phoenix = new Phoenix(this);
        phoenix.scale.multiplyScalar(0.1);
        //phoenix.rotation.y = Math.PI/2;
        phoenix.position.set(30, 0,500);
        //this.add(phoenix, lights);
        globals.phoenix = phoenix;
        globals.phoenix_flag = true;

        // Add Birds
        const birds = new Birds(this);
        birds.scale.multiplyScalar(25);
        //birds.rotation.y = -1 * Math.PI/2;
        birds.position.set(300, 0,500);
        this.add(birds, lights);
        globals.birds = birds;

        // Add Barn 
        const barn = new Barn(this);
        barn.scale.multiplyScalar(0.05);
        barn.position.set(300, -45,0);
        barn.rotation.y = Math.PI;
        this.add(barn, lights);
        

        // add Multiple Cacti
        this.addCacti(this, lights);

        // add windmill
        const windmill = new Windmill(this);
        windmill.scale.multiplyScalar(0.1);
        windmill.position.set(-300, -45,10);
        windmill.rotation.y = -1 * Math.PI/2;
        this.add(windmill, lights);

        // Add sheep and wolves to scene
        const sheep = new Sheep1(this);
        const wolf = new Wolf1(this);
        wolf.scale.multiplyScalar(5);
        this.add(sheep, wolf);

        // add pointer
        const pointer = new Pointer(this);
        pointer.scale.multiplyScalar(1);
        pointer.rotation.y = Math.PI/2;
        globals.pointer = pointer;

        // initialize sheep and wolf global arrays
        globals.wolves = [];
        globals.wolves.push(wolf);
        globals.sheep = sheep;

        // Hitbox visualizer
        // const sheephelper = new Box3Helper( sheep.hitbox, 0xffff00 );
        // this.add( sheephelper );

        // const wolfhelper = new Box3Helper( wolf.hitbox, 0xffff00 );
        // this.add( wolfhelper );


        // initialize sheep and wolf global arrays
        globals.wolves.push(wolf);
        globals.sheep = sheep;

        // initialize bullets array
        globals.bullets = [];

        //this.state.prevMapObject = s_mountains;
        //this.state.prevLightsObject = lights;
        
        // add box to scene 
        var min = new Vector3(70,-45,30);
        var max = new Vector3(200, -7, 200);
        const box = new Box3(min, max);
        globals.arena = box;
        //const helper = new Box3Helper( box, 0xFF0000 );
        this.add(box, lights);
    }

    shootBullet(controls) {
        var camera = controls.getObject();

        const bullet = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.2, 32, 32), new THREE.MeshBasicMaterial({
            color: 'black'
        })); 
        // camera.add(bullet);
        bullet.position.copy(camera.getWorldPosition(new Vector3()));
        bullet.quaternion.copy(camera.quaternion);
        bullet.translateZ(-5);
        bullet.translateY(-0.2);
        bullet.rotateX(Math.PI / 2);
        bullet.direction = controls.getDirection(new Vector3()).normalize();
        bullet.direction.y -= 0.05;
        bullet.timer = new Clock();
        bullet.timer.start();

        globals.bullets.push(bullet);
        this.add(bullet);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const {rotationSpeed, updateList} = this.state;
        this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // update bullets & wolf damage
        globals.bullets.forEach(b => {
            b.position.addScaledVector(b.direction, BULLETSPEED);

            globals.wolves.forEach(wolf => {
                if (wolf.hitbox.containsPoint(b.position)){
                    wolf.takeDamage();
                    this.remove(b);
                    globals.bullets.splice(globals.bullets.indexOf(b), 1);
                    
                    if (wolf.health <= 0){
                        this.remove(wolf);
                        const index = globals.wolves.indexOf(wolf);
                        globals.wolves.splice(index, 1);
                        wolfhurt.play()
                        globals.score += 100
                    }
                }
            })
            // remove bullets from scene after set amount of time (defined at top)
            if (b.timer.getElapsedTime() >= BULLETLIFESPAN) {
                this.remove(b);
            }
        });

            
        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }

    addCacti(scene, lights) {
        var n = 10;

        // randomly add cacti around four sides of the box
        
        // side 1
        for(let i=0; i<n; i++) {
            let x = this.randomNumber( 30, 300);
            let z = this.randomNumber(205, 500);
            const cactus = new Cactus(this);
            cactus.scale.multiplyScalar(this.randomNumber(0.3,1));
            cactus.position.set(x, -55,z);
            scene.add(cactus, lights);
        }

        // side 2
        for(let i=0; i<n; i++) {
            let x = this.randomNumber( 205, 500);
            let z = this.randomNumber(100, 205);
            const cactus = new Cactus(this);
            cactus.scale.multiplyScalar(this.randomNumber(0.3,1));
            cactus.position.set(x, -55,z);
            scene.add(cactus, lights);
        }

        // side 3
        for(let i=0; i<n; i++) {
            let x = this.randomNumber(-300, 0);
            let z = this.randomNumber(-10, 290);
            const cactus = new Cactus(this);
            cactus.scale.multiplyScalar(this.randomNumber(0.3,1));
            cactus.position.set(x, -40,z);
            scene.add(cactus, lights);
        }

        // side 4
        for(let i=0; i<n; i++) {
            let x = this.randomNumber(30, 200);
            let z = this.randomNumber(-270, 30);
            const cactus = new Cactus(this);
            cactus.scale.multiplyScalar(this.randomNumber(0.3,1));
            cactus.position.set(x, -40,z);
            scene.add(cactus, lights);
        }

    }

    randomNumber(min, max) {
        return (Math.random() * (max - min) + min);
    }

}

export default SeedScene;
