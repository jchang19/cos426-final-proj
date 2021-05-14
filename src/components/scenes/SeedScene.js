import * as Dat from 'dat.gui';
import { Scene, Color, Vector3, Box3, Box3Helper } from 'three';
import { Sheep1, Desert, Bordered_Mountains, S_Mountains, Gun, Cowboy, Ball, Wolf1, Phoenix, Birds} from 'objects';
import * as THREE from 'three';
import { BasicLights } from 'lights';
import { globals } from '../../global';

const BULLETSPEED = 0.1;

class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
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

        const gun = new Gun(this);
        gun.position.set(15,-7,6.7);
        gun.rotation.z = -1 * Math.PI/10;
        gun.rotation.y = -1 * Math.PI/7;
        gun.scale.multiplyScalar(0.0005);
        this.add(gun, lights);
        globals.gun = gun;
        /*const cowboy = new Cowboy(this);
        cowboy.position.set(-2.2,-4,0);
        cowboy.scale.multiplyScalar(0.003);
        cowboy.rotation.y = -1 * Math.PI/2;
        this.add(cowboy, lights); */

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

        // Add sheep and wolves to scene
        const sheep = new Sheep1(this);
        const wolf = new Wolf1(this);
        wolf.scale.multiplyScalar(5);
        this.add(sheep, wolf);

          // initialize sheep and wolf global arrays
        globals.wolves = [];
        globals.wolves.push(wolf);

        globals.sheep = sheep;

        // Hitbox visualizer
        // const helper = new Box3Helper( sheep.hitbox, 0xffff00 );
        // this.add( helper );

        // const helper2 = new Box3Helper( wolf.hitbox, 0xffff00 );
        // this.add( helper2 );

        // initialize sheep and wolf global arrays
        globals.wolves.push(wolf);
        globals.sheep = sheep;

        // initialize bullets array
        globals.bullets = [];

        //this.state.prevMapObject = s_mountains;
        //this.state.prevLightsObject = lights;

        // Populate GUI
        // this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
        //this.state.gui.add(this.state, 'map', {map1: '1', map2: '2', map3: '3',map4: '4'}).setValue('1');
        
        // add box to scene 
        var min = new Vector3(70,-45,30);
        var max = new Vector3(200, -7, 200);
        const box = new Box3(min, max);
        const helper = new Box3Helper( box, 0xFF0000 );
        this.add(helper, lights);
    }

    shootBullet(controls) {
        var camera = controls.getObject();
        const bullet = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 32), new THREE.MeshBasicMaterial({
            color: "aqua"
        })); 
        // camera.add(bullet);
        bullet.position.copy(camera.getWorldPosition(new Vector3()));
        bullet.quaternion.copy(camera.quaternion);
        bullet.translateX(-0.5);
        bullet.direction = controls.getDirection(new Vector3()).normalize();

        globals.bullets.push(bullet);
        this.add(bullet);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const {rotationSpeed, updateList} = this.state;
        this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        globals.bullets.forEach(b => {
            b.position.addScaledVector(b.direction, BULLETSPEED);
        });

            
        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }

    // function to return the map object given its corresponding id
    mapObjectFromId(mapId) {
        var newMap = null;
        if (mapId == '1') {
            newMap = new Bordered_Mountains(this);
            newMap.position.set(0,0,0);
        }
        else if (mapId == '2') {
            
            newMap.position.set(0,0,0);
        }
        else if (mapId == '3') {
            
            newMap.position.set(0,0,0);
        }

        return newMap;

    }
}

export default SeedScene;
