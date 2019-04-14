import * as THREE from '../js/three';
import OrbitControls from '../js/OrbitControls';
import PointerLockControls from '../js/PointerLockControls';
// import FirstPersonVRControls from '../js/FirstPersonVRControls';
import enemy from './enemies';
import Enemy from './enemies';
import MTLLoader from '../js/MTLLoader';
import OBJLoader from '../js/OBJLoader';

// if (!THREE.FirstPersonVRControls && window.FirstPersonVRControls) {
//     console.log('Found FirstPersonVRControls on the window');
//     THREE.FirstPersonVRControls = FirstPersonVRControls;
//   }
//to display we need three things, a scene a camera and a renderer

const width = window.innerWidth;
const height = window.innerHeight;
//scene.constructor takes no arguments 
//however it decideds what is being rendered
const scene = new THREE.Scene();

//perspective camera takes 3 arguments
//(fov - field of view , aspect, near, far)
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.z = 5;

//WebGlrenderer takes in no arguments
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);

//once we have the renderer ready we need to put it on to the body of the page
//this works as the canvas element
document.body.appendChild(renderer.domElement);


//example to create a cube
// const geometry1 = new THREE.BoxGeometry( 15, 17, 20 );
// const material1 = new THREE.MeshBasicMaterial( { color: 0xDCDCDC} );
// const cube1 = new THREE.Mesh( geometry1, material1 );
// cube1.position.setX(12)
// cube1.position.setY(12)


// scene.add( cube1 );

// const geometry2 = new THREE.BoxGeometry( 15, 17, 20 );
// const material2 = new THREE.MeshBasicMaterial( { color: 0xDCDCDC} );
// const cube2 = new THREE.Mesh( geometry2, material2 );
// cube2.position.setX(-12)
// cube2.position.setY(-12)


// scene.add( cube2 );

// const geometry3 = new THREE.BoxGeometry( 15, 17, 20 );
// const material3 = new THREE.MeshBasicMaterial( { color: 0xDCDCDC } );
// const cube3 = new THREE.Mesh( geometry3, material3 );
// cube3.position.setX(-12)
// cube3.position.setY(12)


// scene.add( cube3 );
// const geometry4 = new THREE.BoxGeometry( 15, 17, 20 );
// const material4 = new THREE.MeshBasicMaterial( { color: 0xDCDCDC} );
// const cube4 = new THREE.Mesh( geometry4, material4 );
// cube4.position.setX(12)
// cube4.position.setY(-12)


// scene.add( cube4 );



const objLoader = new OBJLoader();
objLoader.setPath('/blender-files/');

const mtlLoader = new MTLLoader();
mtlLoader.setPath('/blender-files/');

new Promise((resolve) => {
    mtlLoader.load('monkey.mtl', (materials) => {
        resolve(materials);
    });
})
    .then((materials) => {
        materials.preload();
        objLoader.setMaterials(materials);
        objLoader.load('monkey.obj', (object) => {
            // monkey = object;
            scene.add(object);
        });
    });

class Player {
    constructor(pos = {x: 0, y: 0, z:5}) {
        const spriteMap = new THREE.TextureLoader().load("images/swat-soldier-vs-zombies-isometric-2d-sprites/SWAT_soldier/swat_recharge_v01_26.png");
        const spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap, color: 0xffffff });
        this.swat = new THREE.Sprite(spriteMaterial);
        this.swat.scale['x'] = 5
        this.swat.scale['y'] = 5
        this.swat.scale['z'] = 5
        this.swat.position.setX(pos.x)
        this.swat.position.setY(pos.y)
        this.swat.position.setZ(pos.z)
        this.x = pos.x;
        this.y = pos.y;
        this.moveDown = this.moveDown.bind(this);
        this.moveUp = this.moveUp.bind(this);
        this.moveRight = this.moveRight.bind(this);
        this.moveLeft = this.moveLeft.bind(this);
    }
    moveDown(){
        this.y -= 1;
    }
    moveUp(){
        this.y += 1;
    }
    moveRight(){
        this.x += 1;
    }
    moveLeft(){

        this.x -= 1;
    }
}
window.addEventListener('keydown', function(event) {
    switch (event.which) {
      case 37: // Left
        player1.moveLeft();
        player1.swat.position['x'] += 1;
      break;
  
      case 38: // Up
        player1.moveUp();
        player1.swat.position['y'] += 1;
      break;
  
      case 39: // Right
        player1.moveRight();
        player1.swat.position['x'] -= 1;

      break;
  
      case 40: // Down
        player1.moveDown();
        player1.swat.position['y'] -= 1;

      break;
    }
  }, false);


  
const player1 = new Player();
// player1.rotation.y = Math.PI / 2

// scene.add(player1.swat)




// automatically omnce we add an geometry to the scene, it gets added to coordinates (0,0,0)
// as well as the camera.  To fix this we reset the cameras z position.


//lets make the hallway of an apartment with two plane geometry on top of each other.
// const plane1geometry = new THREE.PlaneGeometry(40, 40)
// const plane1material = new THREE.MeshBasicMaterial( {color: 0xF5F5DC, side: THREE.DoubleSide} );
// const plane1 = new THREE.Mesh( plane1geometry, plane1material );
// plane1.position.setZ(-10)
// scene.add( plane1 );

// const plane2geometry = new THREE.PlaneGeometry(40, 40)
// const plane2material = new THREE.MeshBasicMaterial( {color: 0xFAF0E6, side: THREE.DoubleSide} );
// const plane2 = new THREE.Mesh( plane2geometry, plane2material );
// plane2.position.setZ(10)
// scene.add( plane2 );


// const enemies = [];

// const spawnEnemy = () => {
//     const coordinates = [{x:-20, y: 0, z:5 }, {x:20, y: 0, z:5},{x:0, y: -20, z:5 },{x:0, y: 20, z:5 } ];
//     const coordinate = coordinates[Math.floor(Math.random() * coordinates.length)]
//     const enemy = new Enemy(coordinate);
//     enemies.push(enemy);
//     scene.add(enemy);
//     console.log(enemies);
// }
// setInterval(spawnEnemy, 1000)


// const rig = new THREE.Object3D();
// rig.add(camera);
// scene.add(rig);
// // lets set up the controls to be able to see the entire plane
// const fpVrControls = new FirstPersonVRControls(camera, scene, rig);
// fpVrControls.verticalMovement = true;
// fpVrControls.strafing = true;
const controls = new OrbitControls(camera)
const clock = new THREE.Clock();
camera.position.set(0,0,40);
controls.update();


const gameOver = function(){
    alert("Game Over");
}

function update(){
    //this is going to be on the logic of the zombies
    // enemies.forEach((enemy, idx) => {
    //     ['x','y'].forEach(dir =>{
    //         if (enemy.position[dir] > 0){
    //             enemy.position[dir] -= Math.random()/10;
    //         };
    //         if (enemy.position[dir] < 0){
    //             enemy.position[dir] += Math.random()/10;
    //         }
    //     })
    //     if (Math.floor(enemy.position['x']) === 0 && Math.floor(enemy.position['y']) === 0){
    //         scene.remove(enemy);
    //         enemies.splice(idx,1);

    //         enemy.material.dispose();
    //         enemy.geometry.dispose();
            
    //     }
    //     // debugger
    //     if(Math.floor(player1.swat.position.x) === Math.floor(enemy.position.x) && Math.floor(player1.swat.position.y) === Math.floor(enemy.position.y)){
    //         scene.remove(enemy);
    //         enemies.splice(idx,1);
    //         enemy.material.dispose();
    //         enemy.geometry.dispose();
    //         gameOver();
    //     }

    // })
    controls.update();
    // camera.position.setZ(-10);
    // camera.position.setX(0);
    // camera.position.setY(0);



}



function animate() {
    requestAnimationFrame( animate );
    // requestAnimationFrame(spawnEnemy);
    // fpVrControls.update(clock.getDelta());
    update();
    // console.log(scene)
    // console.log(camera)
	renderer.render( scene, camera );
}
animate();




// We need to make sure that on resizing the field is cooperative 
window.addEventListener('resize', function () {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
