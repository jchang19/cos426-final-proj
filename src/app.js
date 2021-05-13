/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { SeedScene } from 'scenes';
import { globals } from './global';
import Wolf from './components/objects/Wolf/wolf';

var bins = require.context("../", true, /.*\.bin/);
var pngs = require.context("../", true, /.*\.png/);
console.log(bins);
console.log(pngs);

// CONSTANTS
const ACCELERATION = 0.01;
const DECELERATION = 0.02;
const MAXSPEED = 0.1;

// Initialize core ThreeJS components
const scene = new SeedScene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });

// Set up camera
camera.position.set(6,0, 0);
camera.lookAt(new Vector3(-2.2, -2, 0));

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Set up controls

const controls = new PointerLockControls(camera, document.body);
scene.add(controls.getObject());
var moveForward = false; 
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var vFront = 0.0;
var vLeft = 0.0;
var vBack = 0.0;
var vRight = 0.0;
const onKeyDown = function (event) {

  switch (event.code) {

    case 'ArrowUp':
    case 'KeyW':
      moveForward = true;
      break;

    case 'ArrowLeft':
    case 'KeyA':
      moveLeft = true;
      break;

    case 'ArrowDown':
    case 'KeyS':
      moveBackward = true;
      break;

    case 'ArrowRight':
    case 'KeyD':
      moveRight = true;
      break;

  }
};

const onKeyUp = function (event) {

  switch (event.code) {

    case 'ArrowUp':
    case 'KeyW':
      moveForward = false;
      break;

    case 'ArrowLeft':
    case 'KeyA':
      moveLeft = false;
      break;

    case 'ArrowDown':
    case 'KeyS':
      moveBackward = false;
      break;

    case 'ArrowRight':
    case 'KeyD':
      moveRight = false;
      break;

  }
};
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);
const clampSpeed = (vel) => {
    var speed;
    speed = Math.max(0, vel);
    return Math.min(MAXSPEED, speed);
}
// Handle controls movement
const controlsHandler = () => {
    // front back
    if (moveForward) {
        vFront = clampSpeed(vFront + ACCELERATION);
    } else {
        vFront = clampSpeed(vFront - DECELERATION);
        
    }
    if (moveLeft) {
        vLeft = clampSpeed(vLeft + ACCELERATION);
    } else {
        vLeft = clampSpeed(vLeft - DECELERATION);
    }
    // right left
    if (moveBackward) {
        vBack = clampSpeed(vBack + ACCELERATION);
    } else {
        vBack = clampSpeed(vBack - DECELERATION);
    }
    if (moveRight) {
        vRight = clampSpeed(vRight + ACCELERATION);
    } else {
        vRight = clampSpeed(vRight - DECELERATION);
    }

    // update position
    controls.moveForward(vFront - vBack);
    controls.moveRight(vRight - vLeft);
}

// controls.connect();
window.addEventListener('click', function () {
    controls.lock()
});

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    // controls.update();
    controlsHandler();
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);


    // console.log(timeStamp)
    // Spawn wolf every 5 seconds
    // if (timeStamp % 5000 === 0){
    //   var newwolf = new Wolf();
    //   scene.add(newwolf);
    //   globals.wolves.push(newwolf)
    // }
    
    // MOVE SHEEP
    globals.sheep.move();

    // MOVE WOLVES
    if (globals.sheep.health > 0){
      for (let i = 0; i < globals.wolves.length; i ++){
        globals.wolves[i].move();
  
        if (globals.wolves[i].hitbox.clone().intersectsBox(globals.sheep.hitbox)){
          globals.sheep.takedamage();
        }
  
        if (globals.sheep.health <= 0){
          scene.remove(globals.sheep)
        }
      }
    }
    
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);

