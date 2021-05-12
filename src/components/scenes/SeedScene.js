import * as Dat from 'dat.gui';
import { Scene, Color, Vector3 } from 'three';
import { Sheep, Sheep1, Desert, Bordered_Mountains, S_Mountains, Gun, Cowboy, Ball, Wolf, Wolf1} from 'objects';
import { BasicLights } from 'lights';
import { globals } from '../../global';

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
        const sheep = new Sheep1(this);
        const wolf = new Wolf1(this);
        console.log(wolf);
        wolf.scale.multiplyScalar(0.75);
        this.add(sheep, wolf);

        // initialize sheep and wolf global arrays
        globals.wolves = [];
        globals.wolves.push(wolf)

        globals.sheeps = [];
        globals.sheeps.push(sheep)

        //this.state.prevMapObject = s_mountains;
        //this.state.prevLightsObject = lights;

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
        //this.state.gui.add(this.state, 'map', {map1: '1', map2: '2', map3: '3',map4: '4'}).setValue('1');
        

    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const {rotationSpeed, updateList} = this.state;
        this.rotation.y = (rotationSpeed * timeStamp) / 10000;
            
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
