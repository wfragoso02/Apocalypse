
import * as THREE from '../js/three';
import PointerLockControls from '../js/PointerLockControls';
import OrbitControls from '../js/OrbitControls';
import GLTFLoader from '../js/GLTFLoader';
Physijs.scripts.worker = "/js/physijs_worker.js";
Physijs.scripts.ammo = "/js/ammo.js";

// import 

//What the user is interacting with
const scene = new THREE.Scene();
//How the client is seeing the 3D (perspective makes everything closer bigger, everything further smaller)
//the params are (x, ratio, near viewing plane, far viewing plane )
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
//renderer is what is showing the world
const renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement)
renderer.setSize(window.innerWidth, window.innerHeight);

var fieldWidth = 400, fieldHeight = 200;

var planeMaterial =
new THREE.MeshLambertMaterial(
{
    color: 0x4BD121
});
var planeWidth = fieldWidth,
		planeHeight = fieldHeight,
		planeQuality = 10;
// create the playing surface plane
var plane = new THREE.Mesh(
    new THREE.PlaneGeometry(
    planeWidth * 0.95,	// 95% of table width, since we want to show where the ball goes out-of-bounds
    planeHeight,
    planeQuality,
    planeQuality),
    planeMaterial);

scene.add(plane);

//this is for any resizing of the browser so that it automatically sets the browser to listen to the 
// view port and adjust
window.addEventListener('resize', function () {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}
)

// const controls = new PointerLockControls(camera, renderer.domElement)
const controls = new OrbitControls(camera, renderer.domElement)

//Create new geometry
// boxGeometry takes in axis height ( x, y, z)
// const geometry = new THREE.BoxGeometry(1, 1, 1);

// //Create a material color or texture
// const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: false });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

// const geometry2 = new THREE.Geometry();
// geometry2.vertices.push(new THREE.Vector4(-10, 0, 0));
// geometry2.vertices.push(new THREE.Vector4(0, -10, 0));
// // geometry2.vertices.push(new THREE.Vector3(-5, 0, 0));
// geometry2.vertices.push(new THREE.Vector4(0, 0, 10));
// geometry2.vertices.push(new THREE.Vector4(0, 10, 0));
// geometry2.vertices.push(new THREE.Vector4(10, 0, 0));

// var line = new THREE.Line(geometry2, material);

// scene.add(line);
scene.add(camera)
camera.position.z = 320;

const square = new THREE.Geometry();

square.vertices.push(new THREE.Vector3(0, 0, 0));
square.vertices.push(new THREE.Vector3(0, 100, 0));
square.vertices.push(new THREE.Vector3(100, 100, 0));
square.vertices.push(new THREE.Vector3(100, 0, 0));

square.vertices.push(new THREE.Vector3(0, 0, 0));

square.faces.push(new THREE.Face3(0, 1, 2));
square.faces.push(new THREE.Face3(0, 3, 2));

var line = new THREE.Line(square, new THREE.LineBasicMaterial({ color: 0xffff, opacity: 1 }));
// scene.add(line)
function Enviroment(){

    var enviromentFrameGeometry = new THREE.BoxGeometry( 33, 4, 5 );
    var enviromentFrameMesh = new THREE.MeshStandardMaterial({ color: 0x333333 });
    bus.frame = new Physijs.BoxMesh(enviromentFrameGeometry, enviromentFrameMesh, 100 );
    let enviroment = this;
    var loader = new GLTFLoader();
    loader.load(
        "/enviroment.glb",
        function ( gltf ) {
            debugger
          var scale = 5.6;
          enviroment.body = gltf.scene.children[0];
          enviroment.body.name = "body";
          enviroment.body.rotation.set ( 0, -1.5708, 0 );
          enviroment.body.scale.set (scale,scale,scale);
          enviroment.body.position.set ( 0, 3.6, 0 );
          enviroment.body.castShadow = true;
          enviroment.frame.add(enviroment.body);
       },
    );
    scene.add( enviroment.frame )
}
Enviroment();
//game logic
// everything we are checking at every frame, in our case the zombies getting closer
// and other game logic
const update = function () {
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    // cube.rotation.z += 0.001;
};

//draw scene
// pretty much everything that you want to draw, zoimbies, world, and bullets when fired
const render = function () {
    renderer.render(scene, camera);
};

//run game loop (update, render, repeat)

const GameLoop = function () {
    //allows us to run the gameloop every single frame
    requestAnimationFrame(GameLoop);
    update();
    render();
};

GameLoop(); 

