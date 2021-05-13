import * as Dat from 'dat.gui';
import { Scene, Color, Vector3, Box3Helper } from 'three';
import * as THREE from 'three';
import { Sheep, Desert, Bordered_Mountains, S_Mountains, Gun, Cowboy, Ball, Wolf} from 'objects';
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
            //map:  "1",
            //prevMapId: "1",
            //prevMapObject: null,
            //prevLightsObject: null,
        };

        // Set background to a nice color
        this.background = new Color(0xA9DEF9);

        // Add meshes to scene
        const lights = new BasicLights();

        // add striking moutains to the scene as a default
        const s_mountains = new S_Mountains(this);
        s_mountains.position.set(0,0,0);
        this.add(s_mountains, lights);

        const gun = new Gun(this);
        gun.position.set(-3,-3.4,0.3);
        gun.rotation.z = -1 * Math.PI/10;
        //gun.rotation.y = -1 * Math.PI/16;
        gun.scale.multiplyScalar(0.0005);
        this.add(gun, lights);


        const cowboy = new Cowboy(this);
        cowboy.position.set(-2.2,-4,0);
        cowboy.scale.multiplyScalar(0.003);
        cowboy.rotation.y = -1 * Math.PI/2;
        this.add(cowboy, lights);


        const ball = new Ball(this);
        ball.position.set(-3.5,-3.3,0.3);
        ball.scale.multiplyScalar(0.00002);
        this.add(ball, lights);

        // Add sheep and wolves to scene
        const sheep = new Sheep(this);
        const wolf = new Wolf(this);
        this.add(sheep, wolf);

        // Hitbox visualizer
        // const helper = new Box3Helper( sheep.hitbox, 0xffff00 );
        // this.add( helper );

        // const helper2 = new Box3Helper( wolf.hitbox, 0xffff00 );
        // this.add( helper2 );

        // initialize sheep and wolf global arrays
        globals.wolves = [];
        globals.wolves.push(wolf)

        globals.sheep = sheep;

        // initialize bullets array
        globals.bullets = [];

        //this.state.prevMapObject = s_mountains;
        //this.state.prevLightsObject = lights;

        // Populate GUI
        // this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
        //this.state.gui.add(this.state, 'map', {map1: '1', map2: '2', map3: '3',map4: '4'}).setValue('1');
        
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
        // console.log('updating');
        globals.bullets.forEach(b => {
            b.position.addScaledVector(b.direction, BULLETSPEED);
        });
                
        // if the user has not selected a new map
        /*if (map != prevMapId) {
            this.remove(prevLightsObject);
            this.remove(prevMapObject);  // remove the previous map
            var lights = new BasicLights();
            var newMap = this.mapObjectFromId(map);  // create the new map
            this.add(newMap, lights); // add the new map to the scene

            this.state.prevMapId = map; // update state tracker variables respectively
            this.state.prevMapObject = newMap;
            this.state.prevLightsObject = lights;
        }*/
            
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
