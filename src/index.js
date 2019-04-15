import * as THREE from '../js/three';
import MTLLoader from '../js/MTLLoader';
import OBJLoader from '../js/OBJLoader';
import OrbitControls from '../js/OrbitControls';
import TDSLoader from '../js/TDSLoader';
import GLTFLoader from '../js/GLTFLoader';
import Enemy from './enemies';



function detectCollisionRaycaster(originObject, collidedObjects, 
    doesCollidedObjectsEndGame) {
    
    let objectMesh = originObject.children[0].children[2];
    
    let originPoint = originObject.position.clone();
    
    if (cooldown === false) {
        for (var vertexIndex = 0; vertexIndex < objectMesh.geometry.vertices.length; vertexIndex++) {
            var localVertex = objectMesh.geometry.vertices[vertexIndex].clone();
            var globalVertex = localVertex.applyMatrix4( objectMesh.matrix );
            var directionVector = globalVertex.sub( objectMesh.position );
    
            var raycaster = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
            var collisionResults = raycaster.intersectObjects( collidedObjects, true );
            if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
                if (doesCollidedObjectsEndGame) {
                    // car objects collided
                    gameIsOver = true;
                    cooldown = true;
                } else {
                    if (cooldown2 === false) {
                        cooldown2 = true;
                        // other objects collided
                        setTimeout(function(){
                            cooldown2 = false;
                        }, 100);
                    }
                }
            }
        }
    }
    }



Physijs.scripts.worker = 'js/physijs_worker.js'
Physijs.scripts.amo ='js/ammo.js'

let monkey;
let player = {height: 5, speed: 0.2, turnSpeed: Math.PI * 0.02, canShoot:0 };
// player = new Physijs.ConcaveMesh(player);

var collisions = [];
function calculateCollisionPoints( mesh, scale, type = 'collision' ) { 
    // Compute the bounding box after scale, translation, etc.
    var bbox = new THREE.Box3().setFromObject(mesh);
    var bounds = {
      type: type,
      xMin: bbox.min.x,
      xMax: bbox.max.x,
      yMin: bbox.min.y,
      yMax: bbox.max.y,
      zMin: bbox.min.z,
      zMax: bbox.max.z,
    };
    collisions.push( bounds );
}



let score = 0;



const scene = new Physijs.Scene();
scene.setGravity( new THREE.Vector3(0, -9.81, 0))
const light = new THREE.AmbientLight('#ffffff', 3.0);
light.position.set(0, 100, 0);
scene.add(light);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set (0, player.height, -5);
player.position = camera.position;
camera.lookAt(new THREE.Vector3(0, player.height, 0));



let stage;
let collidableMeshList = [];
const clock = new THREE.Clock();
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
            // object.children.forEach(mesh => {
            //     mesh.scale.x = mesh.scale.y = mesh.scale.z = 3;
            //     scene.add(mesh)
            // })
            // monkey = object;
            // stage = new Physijs.ConcaveMesh(object);

            object.children.forEach(mesh => {
                const geometry = mesh.geometry;
                const material = mesh.material;
                const newMesh = new Physijs.BoxMesh(geometry, material);
                newMesh.scale.x = newMesh.scale.y = newMesh.scale.z = 3;
                scene.add(newMesh);
                
            });
            stage = object;
            // calculateCollisionPoints( stage );
        });
});

// const planeGeometry = 

// var sphereGeometry = new THREE.SphereGeometry(4, 20, 20)
// var sphereMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, wireframe: false})
// var sphere = new Physijs.SphereMesh(sphereGeometry, sphereMaterial);
// sphere.position.x = 10;
// sphere.position.z = 20;
// scene. add(sphere);

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
// objLoader1.setPath('/blender-files/');

// const mtlLoader1 = new MTLLoader();
// mtlLoader1.setPath('/blender-files/');

// new Promise((resolve) => {
//     mtlLoader1.load('zombie.mtl', (materials) => {
//         resolve(materials);
//     });
// }).then((materials) => {
//         materials.preload();
//         objLoader1.setMaterials(materials);
//         objLoader1.load('zombie.obj', (object) => {
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

const enemies = [];

const spawnEnemy = () => {
    const speeds = [0.1, 0.2, 0.05, 0.01]
    const coordinates = [{x:20, y: 0, z:0 }, {x:0, y: 0, z:-20},{x:-20, y: 0, z:0 },{x:0, y: 0, z:20 } ];
    const coordinate = coordinates[Math.floor(Math.random() * coordinates.length)]
    const speed = speeds[Math.floor(Math.random() * speeds.length)]
    // let enemy;
    const loader = new GLTFLoader();
        loader.load( '/blender-files/real-zombie.glb', function (gltf) {
                const enemy = gltf.scene; // THREE.Scene
                // zombie.rotation.set(new THREE.Vector3( 0, 0, Math.PI / 2));
                // zombie.rotation = Math.PI/2;
                enemy.animations = gltf.animations[0]
                enemy.scale.x = enemy.scale.y = enemy.scale.z = 0.8;
                enemy.position.setX(coordinate.x)
                enemy.position.setY(coordinate.y)
                enemy.position.setZ(coordinate.z)
                enemy.speed = speed
                enemies.push(enemy);
                scene.add(enemy);
                // return zombie;
                // animations = gltf.animations; // Array<THREE.AnimationClip>
                // gltf.scenes; // Array<THREE.Scene>
                // gltf.cameras; // Array<THREE.Camera>
                // gltf.asset; // Object

            },
            // called while loading is progressing
            function (xhr) {

                console.log((xhr.loaded / xhr.total * 100) + '% loaded');

            },
            // called when loading has errors
            function (error) {

                console.log('An error happened');

            }
        );
    
    // console.log(enemies);
}
setInterval(spawnEnemy, 5000)



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
        gun.rotation.set(new THREE.Vector3( 0, 0, Math.PI / 2));
        // gun.rotation = Math.PI/2;
            gun.scale.x = gun.scale.y = gun.scale.z = 0.5;
        gun.animations = gltf.animations;
        scene.add( gun );
        calculateCollisionPoints( gun );

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

// loader.load(
// 	// resource URL
// 	'/blender-files/real-zombie.glb',
// 	// called when the resource is loaded
// 	function ( gltf ) {
//         const zombie1 = gltf.scene; // THREE.Scene
//         // zombie.rotation.set(new THREE.Vector3( 0, 0, Math.PI / 2));
//         // zombie.rotation = Math.PI/2;
//             zombie1.scale.x = zombie1.scale.y = zombie1.scale.z = 0.8;


//         scene.add( zombie1 );
//         calculateCollisionPoints( zombie1 );

// 		// animations = gltf.animations; // Array<THREE.AnimationClip>
// 		// gltf.scenes; // Array<THREE.Scene>
// 		// gltf.cameras; // Array<THREE.Camera>
// 		// gltf.asset; // Object

// 	},
// 	// called while loading is progressing
// 	function ( xhr ) {

// 		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

// 	},
// 	// called when loading has errors
// 	function ( error ) {

// 		console.log( 'An error happened' );

// 	}
// );

// Create an AnimationMixer, and get the list of AnimationClip instances
// var mixer = new THREE.AnimationMixer( mesh );

// // Update the mixer on each frame
// function update () {
// 	mixer.update( deltaSeconds );
// }

// // Play a specific animation
// var clip = THREE.AnimationClip.findByName( animations, 'walk_blocking' );
// var action = mixer.clipAction( clip );
// action.play();

// // Play all animations
// animations.forEach( function ( clip ) {
// 	mixer.clipAction( clip ).play();
// } );

const update = function() {
    
    enemies.forEach((enemy, idx) => {
        // var mixer = new THREE.AnimationMixer(enemy);
        // var animation = enemy.animations;
        
        // var action = mixer.clipAction(animation);
        // action.play();
        // for (var vertexIndex = 0; vertexIndex < enemy.geometry.vertices.length; vertexIndex++) {
        //     var localVertex = enemy.geometry.vertices[vertexIndex].clone();
        //     var globalVertex = enemy.matrix.multiplyVector3(localVertex);
        //     var directionVector = globalVertex.subSelf(enemy.position);

        //     var ray = new THREE.Ray(enemy.position, directionVector.clone().normalize());
        //     var collisionResults = ray.intersectObjects(collidableMeshList);
        //     if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
        //     }
        // }

            ['x','z'].forEach(dir =>{
                if (enemy.position[dir] > camera.position[dir]){
                    enemy.position[dir] -= enemy.speed;
                };
                if (enemy.position[dir] < camera.position[dir]){
                    enemy.position[dir] += enemy.speed;
                }
            })
            if (Math.floor(enemy.position['x']) === 0 && Math.floor(enemy.position['z']) === 0){
                scene.remove(enemy);
                enemies.splice(idx,1);
    
                // enemy.material.dispose();
                // enemy.geometry.dispose();
                
            }
            bullets.forEach(bullet => {
                if((Math.floor(enemy.position['x']) === Math.floor(bullet.position['x'])) && 
                (Math.floor(enemy.position['z']) === Math.floor(bullet.position['z']))){
                    bullet.alive = false;
                    scene.remove(bullet)
                    scene.remove(enemy);
                    enemies.splice(idx, 1);
                    score += 1;
                    console.log(score);
                    // enemy.material.dispose();
                    // enemy.geometry.dispose();
                }

                
            })
            enemy.rotation.set(
                camera.rotation.x,
                camera.rotation.y,
                camera.rotation.z
            )
})
}

// var mixer = new THREE.AnimationMixer( gun );
// var clips = gun.animations;

// // Update the mixer on each frame
// function Gunupdate () {
// 	mixer.update( clock.getDelta() );
// }

// // Play a specific animation
// var clip = THREE.AnimationClip.findByName( clips, 'dance' );
// var action = mixer.clipAction( clip );
// action.play();

// // Play all animations
// clips.forEach( function ( clip ) {
// 	mixer.clipAction( clip ).play();
// } );


function canMove(camera, num){
    if (num === 87){
        if (( camera.position.x - Math.sin(camera.rotation.y) * player.speed > -4 || camera.position.z - -Math.cos(camera.rotation.y) * player.speed > -5)
        && (camera.position.z - -Math.cos(camera.rotation.y) * player.speed > -21 && camera.position.z - -Math.cos(camera.rotation.y) * player.speed < 21)
        && (camera.position.x - Math.sin(camera.rotation.y) * player.speed > -21 && camera.position.x - Math.sin(camera.rotation.y) * player.speed < 21)
        && (camera.position.z - -Math.cos(camera.rotation.y) * player.speed < 5 || camera.position.x - Math.sin(camera.rotation.y) * player.speed > -5)
        && (camera.position.x - Math.sin(camera.rotation.y) * player.speed < 4 || camera.position.z - -Math.cos(camera.rotation.y) * player.speed > -5)
        && (camera.position.x - Math.sin(camera.rotation.y) * player.speed < 4 || camera.position.z - -Math.cos(camera.rotation.y) * player.speed < 5)){
        return true;
        }
    }else if(num === 83){
        if ((camera.position.x + Math.sin(camera.rotation.y) * player.speed > -4 || camera.position.z + -Math.cos(camera.rotation.y) * player.speed > -5)
        && (camera.position.z + -Math.cos(camera.rotation.y) * player.speed > -21 && camera.position.z + -Math.cos(camera.rotation.y) * player.speed < 21)
        && (camera.position.x + Math.sin(camera.rotation.y) * player.speed > -21 && camera.position.x + Math.sin(camera.rotation.y) * player.speed < 21 )
        && (camera.position.z + -Math.cos(camera.rotation.y) * player.speed < 5 || camera.position.x - Math.sin(camera.rotation.y) * player.speed > -5)
        && (camera.position.x + Math.sin(camera.rotation.y) * player.speed < 4 || camera.position.z + -Math.cos(camera.rotation.y) * player.speed > -5)
        && (camera.position.x + Math.sin(camera.rotation.y) * player.speed < 4 || camera.position.z + -Math.cos(camera.rotation.y) * player.speed < 5)){
            return true;
        }
    }else if(num === 65){
        if((camera.position.x + Math.sin(camera.rotation.y + Math.PI / 2) * player.speed > -4 || camera.position.z + -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed > -5)
        && (camera.position.z + -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed > -21 && camera.position.z + -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed < 21)
        && (camera.position.x + Math.sin(camera.rotation.y + Math.PI / 2) * player.speed > -21 && camera.position.x + Math.sin(camera.rotation.y + Math.PI / 2) * player.speed < 21)
        && (camera.position.z + -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed < 5 || camera.position.x + Math.sin(camera.rotation.y + Math.PI / 2) * player.speed > -5)
        && (camera.position.x + Math.sin(camera.rotation.y + Math.PI / 2) * player.speed < 4 || camera.position.z + -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed > -5)
        && (camera.position.x + Math.sin(camera.rotation.y + Math.PI / 2) * player.speed < 4 || camera.position.z + -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed < 5)){
            return true;
        }
    }else if(num === 68){
        if((camera.position.x + Math.sin(camera.rotation.y - Math.PI / 2) * player.speed > -4 || camera.position.z + -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed > -5)
        && (camera.position.z + -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed > -21 && camera.position.z + -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed < 21)
        && (camera.position.x + Math.sin(camera.rotation.y - Math.PI / 2) * player.speed > -21 && camera.position.x + Math.sin(camera.rotation.y - Math.PI / 2) * player.speed < 21 )
        && (camera.position.z + -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed < 5 || camera.position.x + Math.sin(camera.rotation.y - Math.PI / 2) * player.speed > -5)
        && (camera.position.x + Math.sin(camera.rotation.y - Math.PI / 2) * player.speed < 4 || camera.position.z + -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed > -5)
        && (camera.position.x + Math.sin(camera.rotation.y - Math.PI / 2) * player.speed < 4 || camera.position.z + -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed < 5 )){
            return true;
        }
    }
    
}


const bullets = [];



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
    const time = Date.now() * 0.0005;
    const delta = clock.getDelta();
    // scene.simulate();

    requestAnimationFrame(render);
    renderer.render(scene, camera);
    // const canMove = function(player) {
    //     if(scene.children.group){
    // scene.Stimulate();
    //     }
    // }
    
    update();
    if (keyboard[87] && canMove(camera, 87)){
        camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
        camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
    }
    if (keyboard[83] && canMove(camera, 83)){
        camera.position.x += Math.sin(camera.rotation.y) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
    }
    if (keyboard[65] && canMove(camera, 65)){
        camera.position.x += Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed;
    }
    if (keyboard[68] && canMove(camera, 68)){
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
        gun.rotation.x = Math.PI / 2;
        gun.position.set(
            camera.position.x - Math.sin(camera.rotation.y + Math.PI / 6) * 0.6,
            camera.position.y - 0.5 + Math.sin( time * 4) * 0.01,
            camera.position.z + Math.cos(camera.rotation.y + Math.PI / 6) * 0.6
        )
        gun.rotation.set(
            camera.rotation.x,
            camera.rotation.y,
            camera.rotation.z
        )
    }
    bullets.forEach((bullet, idx) => {
        if(bullet.alive === false){
            bullets.splice(idx, 1);
        }else{

            bullet.position.add(bullet.velocity)
        }
    })
    


    if(keyboard[32] && player.canShoot <=0 ){
        // Create an AnimationMixer, and get the list of AnimationClip instances
        var mixer = new THREE.AnimationMixer(gun);
        var clips = gun.animations;


        // Play a specific animation
        // var clip = THREE.AnimationClip.findByName(clips, 'dance');
        // var action = mixer.clipAction(clip);
        // action.play();

        // Play all animations
        clips.forEach(function (clip) {
            mixer.clipAction(clip).play();
        });
        mixer.update( delta )
        let bullet = new THREE.Mesh( 
            new THREE.SphereGeometry(0.05, 6, 32, ),
            new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true})
        )

        bullets.push(bullet)
        bullet.position.set(
            gun.position.x,
            gun.position.y + 0.15,
            gun.position.z
        )
        
        bullet.velocity = new THREE.Vector3(
            -Math.sin(camera.rotation.y),0, Math.cos(camera.rotation.y)
        )
        bullet.alive = true;
        // setTimeout( function(){ 
            
        // }, 500)
        scene.add(bullet);
        player.canShoot = 10;
    }

    if (player.canShoot > 0){
        player.canShoot -= 1;
    }
    // if ( collisions.length > 0 ) {
    //     detectCollisions();
    // }

}
render();

window.addEventListener('resize', function () {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});