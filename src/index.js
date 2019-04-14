import * as THREE from '../js/three';
import MTLLoader from '../js/MTLLoader';
import OBJLoader from '../js/OBJLoader';
import OrbitControls from '../js/OrbitControls';
import TDSLoader from '../js/TDSLoader';
import GLTFLoader from '../js/GLTFLoader';




let monkey;
let player = {height: 1.8, speed: 0.1, turnSpeed: Math.PI * 0.02}

const scene = new THREE.Scene();
const light = new THREE.AmbientLight('#ffffff', 3.0);
light.position.set(0, 100, 0);
scene.add(light);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set (0, player.height, -5);
camera.lookAt(new THREE.Vector3(0, player.height, 0));


const clock = THREE.Clock();
// const loader , vlad, idle, rest, run;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setClearColor( 0xffffff, 0);
document.body.appendChild(renderer.domElement);

const objLoader = new OBJLoader();
objLoader.setPath('/blender-files/');

const mtlLoader = new MTLLoader();
mtlLoader.setPath('/blender-files/');

new Promise((resolve) => {
    mtlLoader.load('stage.mtl', (materials) => {
        resolve(materials);
    });
}).then((materials) => {
        materials.preload();
        objLoader.setMaterials(materials);
        objLoader.load('stage.obj', (object) => {
            // monkey = object;
            const stage = object;
            stage.scale.x = stage.scale.y = stage.scale.z = 3;
            scene.add(stage);
        });
});

// let guns = [];
let gun;
// const objLoader1 = new OBJLoader();
// objLoader1.setPath('/blender-files/Glock/OBJ MTL/');

// const mtlLoader1 = new MTLLoader();
// mtlLoader1.setPath('/blender-files/Glock/OBJ MTL/');

// new Promise((resolve) => {
//     mtlLoader1.load('Glock 3d.mtl', (materials) => {
//         resolve(materials);
//     });
// }).then((materials) => {
//         materials.preload();
//         objLoader1.setMaterials(materials);
//         objLoader1.load('Glock 3d.obj', (object) => {
//             gun = object;
//             // const stage = object;
//             // gun.position.set(
//             //     camera.position.x - Math.sin(camera.rotation.y),
//             //     camera.position.y,
//             //     camera.position.z + Math.cos(camera.rotation.y)
//             // )
//             scene.add(gun);
//         });
// });
// const gun = guns[0]
// debugger

let keyboard= {};
//making my own first person camera view
function keyDown(event){
    keyboard[event.keyCode] = true
}
function keyUp(event){
    keyboard[event.keyCode] = false;
    
}
function keyLeft(event){
    keyboard[event.keycode] = true
    
}
function keyRight(event){
    keyboard[event.keycode] = true
    
}

window.addEventListener('keydown', keyDown)
window.addEventListener('keyup', keyUp)
// window.addEventListener('keyleft', keyLeft)
// window.addEventListener('keyright', keyRight)

// const objLoader1 = new OBJLoader();
// objLoader1.setPath('/blender-files/Typical-Nekro/');

// const mtlLoader1 = new MTLLoader();
// mtlLoader1.setPath('/blender-files/Typical-Nekro/');

// new Promise((resolve) => {
//     mtlLoader1.load('Slasher.mtl', (materials) => {
//         resolve(materials);
//     });
// }).then((materials) => {
//         materials.preload();
//         objLoader1.setMaterials(materials);
//         objLoader1.load('Slasher.obj', (object) => {
//             // monkey = object;
//             const zombie = object;
//             zombie.scale.x = zombie.scale.y = zombie.scale.z = 1.0;
//             zombie.position.y = 1;
//             scene.add(zombie);
//         });
// });

// var loader = new THREE.TextureLoader();
// var normal = loader.load('/blender-files/player/Textures/Text_0018_1.jpg');
// var loader = new TDSLoader();
// loader.setResourcePath('/blender-files/player/Textures/');
// loader.load('/blender-files/player/MP_US_Engi.3ds', function (object) {
//     object.traverse(function (child) {
//         if (child instanceof THREE.Mesh) {
//             child.material.normalMap = normal;
//         }
//     });
//     object.scale.x = object.scale.y = object.scale.z = 0.1;
//     scene.add(object);
// });






var loader = new GLTFLoader();

// Optional: Provide a DRACOLoader instance to decode compressed mesh data
// THREE.DRACOLoader.setDecoderPath( '/examples/js/libs/draco' );
// loader.setDRACOLoader( new THREE.DRACOLoader() );
	
// // Optional: Pre-fetch Draco WASM/JS module, to save time while parsing.
// THREE.DRACOLoader.getDecoderModule();

// Load a glTF resource
let mesh;

// let animations;
loader.load(
	// resource URL
	'/blender-files/Handgun_Game_Blender Gamer Engine.glb',
	// called when the resource is loaded
	function ( gltf ) {
        
        gun = gltf.scene; // THREE.Scene
        // debugger
        gun.rotation.set(new THREE.Vector3( 0, 0, Math.PI / 2));
        // gun.rotation = Math.PI/2;
        // debugger
            gun.scale.x = gun.scale.y = gun.scale.z = 0.5;


        scene.add( gun );

		// animations = gltf.animations; // Array<THREE.AnimationClip>
		// gltf.scenes; // Array<THREE.Scene>
		// gltf.cameras; // Array<THREE.Camera>
		// gltf.asset; // Object

	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);


// Create an AnimationMixer, and get the list of AnimationClip instances
// var mixer = new THREE.AnimationMixer( mesh );

// // Update the mixer on each frame
// function update () {
// 	mixer.update( deltaSeconds );
// }

// // Play a specific animation
// debugger
// var clip = THREE.AnimationClip.findByName( animations, 'walk_blocking' );
// var action = mixer.clipAction( clip );
// action.play();

// // Play all animations
// animations.forEach( function ( clip ) {
// 	mixer.clipAction( clip ).play();
// } );









// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.dampingFactor = 0.25;
// controls.enableZoom = true;
// controls.update();

function init(){
    document.addEventListener('keydown')
}

function render() {
    // if (monkey) {
    //     monkey.rotation.x += 0.01;
    //     monkey.rotation.y += 0.01;
    // }
    // controls.update();

    requestAnimationFrame(render);
    renderer.render(scene, camera);

    if (keyboard[87]){
        camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
        camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
    }
    if (keyboard[83]){
        camera.position.x += Math.sin(camera.rotation.y) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
    }
    if (keyboard[65]){
        camera.position.x += Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed;
    }
    if (keyboard[68]){
        camera.position.x += Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
    }
    

    if (keyboard[37]){
        camera.rotation.y -= player.turnSpeed;
    }
    if (keyboard[39]){
        camera.rotation.y += player.turnSpeed;
    }

    if (gun){
        debugger
        gun.rotation.x = Math.PI / 2;
        gun.position.set(
            camera.position.x - Math.sin(camera.rotation.y) * 0.6,
            camera.position.y - 0.5,
            camera.position.z + Math.cos(camera.rotation.y) * 0.6
        )
        gun.rotation.set(
            camera.rotation.x,
            camera.rotation.y,
            camera.rotation.z
        )
    }


}
render();

window.addEventListener('resize', function () {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});