import * as THREE from '../js/three';
import OrbitControls from '../js/OrbitControls';
import PointerLockControls from '../js/PointerLockControls';
import enemy from './enemies';

//to display we need three things, a scene a camera and a renderer

const width = window.innerWidth;
const height = window.innerHeight;
//scene.constructor takes no arguments 
//however it decideds what is being rendered
const scene = new THREE.Scene();

//perspective camera takes 3 arguments
//(fov - field of view , aspect, near, far)
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

//WebGlrenderer takes in no arguments
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);

//once we have the renderer ready we need to put it on to the body of the page
//this works as the canvas element
document.body.appendChild(renderer.domElement);


//example to create a cube
const geometry1 = new THREE.BoxGeometry( 15, 17, 20 );
const material1 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube1 = new THREE.Mesh( geometry1, material1 );
cube1.position.setX(12)
cube1.position.setY(12)


scene.add( cube1 );

const geometry2 = new THREE.BoxGeometry( 15, 17, 20 );
const material2 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube2 = new THREE.Mesh( geometry2, material2 );
cube2.position.setX(-12)
cube2.position.setY(-12)


scene.add( cube2 );

const geometry3 = new THREE.BoxGeometry( 15, 17, 20 );
const material3 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube3 = new THREE.Mesh( geometry3, material3 );
cube3.position.setX(-12)
cube3.position.setY(12)


scene.add( cube3 );
const geometry4 = new THREE.BoxGeometry( 15, 17, 20 );
const material4 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube4 = new THREE.Mesh( geometry4, material4 );
cube4.position.setX(12)
cube4.position.setY(-12)


scene.add( cube4 );
// automatically omnce we add an geometry to the scene, it gets added to coordinates (0,0,0)
// as well as the camera.  To fix this we reset the cameras z position.


//lets make the hallway of an apartment with two plane geometry on top of each other.
const plane1geometry = new THREE.PlaneGeometry(40, 40)
const plane1material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
const plane1 = new THREE.Mesh( plane1geometry, plane1material );
plane1.position.setZ(-10)
scene.add( plane1 );

const plane2geometry = new THREE.PlaneGeometry(40, 40)
const plane2material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
const plane2 = new THREE.Mesh( plane2geometry, plane2material );
plane2.position.setZ(10)
scene.add( plane2 );
const enemies = [];

const enemy1 = new enemy({x:-20, y: 0, z:0 });
enemies.push(enemy1);
scene.add(enemy1)
const enemy2 = new enemy({x:20, y: 0, z:0 });
scene.add(enemy2)
enemies.push(enemy2);

const enemy3 = new enemy({x:0, y: -20, z:0 });
scene.add(enemy3)
enemies.push(enemy3);

const enemy4 = new enemy({x:0, y: 20, z:0 });
scene.add(enemy4)
enemies.push(enemy4);

// lets set up the controls to be able to see the entire plane
const controls = new OrbitControls(camera);
camera.position.set(0,0,40);
controls.update();

function update(){
    //this is going to be on the logic of the zombies
    // enemy1.position.x += 0.01;
    // enemy1.position.x += 0.01;
    // enemy1.position.x += 0.01;
    // enemy1.position.x += 0.01;
    enemies.forEach(enemy => {
        ['x','y'].forEach(dir =>{
            if (enemy.position[dir] > 0){
                enemy.position[dir] -= 0.01;
            };
            if (enemy.position[dir] < 0){
                enemy.position[dir] += 0.01;
            }
        })
    })
    controls.update();
    camera.position.setZ(-10);



}



function animate() {
    requestAnimationFrame( animate );
    update();
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
