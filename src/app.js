/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3, Clock } from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { SeedScene } from 'scenes';
import { globals } from './global';
import { Wolf1} from 'objects';
import {WolfHowl, Soundtrack, WolfGrowl, Sheepbaa, HurtSheep, Shot} from './audio'

// Clock
var clock = new Clock();

// CONSTANTS
const ACCELERATION = 0.01;
const DECELERATION = 0.02;
const MAXSPEED = 0.05;
var gameStarted = false;

// Initialize core ThreeJS components
const scene = new SeedScene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });

// Set up camera
camera.position.set(75,-40, 50);
camera.lookAt(new Vector3(200, -40, 200));

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Add music and soudn effects
var audio = new Audio(Soundtrack);
var howlaudio = new Audio(WolfHowl);
var growlaudio = new Audio(WolfGrowl);
var baa = new Audio(Sheepbaa);
var sheephurt = new Audio(HurtSheep);
var shootaudio = new Audio(Shot);
// audio.play();
// console.log(audio)

camera.add(globals.pointer);
globals.pointer.position.set(3.1,10,-5);
globals.pointer.rotation.y = Math.PI/6;

// Set up controls
const controls = new PointerLockControls(camera, document.body);
controls.addEventListener('lock', function () {

  instructions.style.display = 'none';
  blocker.style.display = 'none';
  gameStarted = true;

});

controls.addEventListener('unlock', function () {

  blocker.style.display = 'block';
  instructions.style.display = '';
  gameStarted = false;

});

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
  if (gameStarted) {
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
      
      case 'Space':
        onClick();

    }
  }
};

const onKeyUp = function (event) {
  if (gameStarted) {
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
    controls.moveForward((vFront - vBack)*10); // Jayson magnified this temporarily 
    controls.moveRight((vRight - vLeft)*10);
    var x = camera.position.x -0.7;
    var y = camera.position.y;
    var z = camera.position.z - 0.8; 
    globals.gun.position.set(x,y,z);
}

// controls.connect();
document.addEventListener('click', function () {
    controls.lock();
});

// shoot event
const onClick = function (event) {
    //console.log('shoot');
    if (gameStarted) {
        scene.shootBullet( controls);
        shootaudio.play()
    }
}
document.addEventListener('mousedown', onClick);

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    
    // controls.update();
    controlsHandler();
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    
    // Animate Animals
    var delta = clock.getDelta();
    globals.mixers.forEach((mixer) => {
      if(mixer) mixer.update(delta);
    });

    
    // Move Phoenix bird
    //globals.phoenix.move()

    // Move regular birds
    globals.birds.move()

    globals.sheep.move()

    // MOVE WOLVES
    if (globals.sheep.health > 0 && gameStarted){

      globals.wolves.forEach((wolf) => {
        wolf.move();

        if (wolf.hitbox.clone().intersectsBox(globals.sheep.hitbox)){
          globals.sheep.takeDamage();
          sheephurt.play()
        }

        if (globals.sheep.health <= 0){
          scene.remove(globals.sheep);
        }

      });

      // Spawn wolf every so often
      if (globals.counter % 100 === 0){
      var newwolf = new Wolf1(scene);
      newwolf.scale.multiplyScalar(5);
      scene.add(newwolf);
      globals.wolves.push(newwolf)
      }
    }

    if (globals.counter % 1000 === 0){
      howlaudio.play();
    }
    if (globals.counter % 800 === 0){
      growlaudio.play();
    }
    if (globals.counter % 500 === 0){
      baa.play();
    }
    
    globals.counter += 1;
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
