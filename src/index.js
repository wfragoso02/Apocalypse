import * as THREE from '../js/three';
import GLTFLoader from '../js/GLTFLoader';
import Enemy from './enemies';

let gameOver = false;
let player = {height: 5, speed: 0.2, turnSpeed: Math.PI * 0.02, canShoot:0 };
let kills = 0;

const scene = new THREE.Scene();
const light = new THREE.AmbientLight('#ffffff', 3.0);
light.position.set(0, 100, 0);
scene.add(light);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set (0, player.height, -5);
player.position = camera.position;
camera.lookAt(new THREE.Vector3(0, player.height, 0));

const clock = new THREE.Clock();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const loader = new GLTFLoader();

loader.load( '/blender-files/stage.glb', function (gltf) {
    const stage = gltf.scene; 
    stage.scale.x = stage.scale.y = stage.scale.z = 3;
    scene.add(stage);
})

let keyboard= {};
function keyDown(event){
    keyboard[event.keyCode] = true;
}
function keyUp(event){
    keyboard[event.keyCode] = false;    
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

let enemies = [];
const spawnEnemy = () => {
    const speeds = [0.1, 0.2, 0.05, 0.01];
    const coordinates = [{x:20, y: 0, z:0 }, {x:0, y: 0, z:-20},{x:-20, y: 0, z:0 },{x:0, y: 0, z:20 } ];
    const coordinate = coordinates[Math.floor(Math.random() * coordinates.length)];
    const speed = speeds[Math.floor(Math.random() * speeds.length)];
    loader.load( '/blender-files/real-zombie.glb', function (gltf) {
            const enemy = gltf.scene;
            enemy.scale.x = enemy.scale.y = enemy.scale.z = 0.8;
            enemy.position.setX(coordinate.x)
            enemy.position.setY(coordinate.y)
            enemy.position.setZ(coordinate.z)
            enemy.speed = speed
            enemies.push(enemy);
            scene.add( enemy );
            }
    );

}

let gun;
loader.load( '/blender-files/Handgun_Game_Blender Gamer Engine.glb', function ( gltf ) {
    gun = gltf.scene; 
    gun.rotation.set(new THREE.Vector3( 0, 0, Math.PI / 2));
    gun.scale.x = gun.scale.y = gun.scale.z = 0.5;
    scene.add( gun );
	}
);

const config = {
    apiKey: "AIzaSyDaH0oVhOcPzsjCioX-w5V2py51y1kMp04",
    authDomain: "apocalypse-9ab24.firebaseapp.com",
    databaseURL: "https://apocalypse-9ab24.firebaseio.com",
    projectId: "apocalypse-9ab24",
    storageBucket: "apocalypse-9ab24.appspot.com",
    messagingSenderId: "818851881974"
};

firebase.initializeApp(config);
const database = firebase.database();
const ref = database.ref('scores');


ref.on('value', getData, errData);

function errData(err) {
    console.log('Error!');
    console.log(err);
}

function getData(data){
    const scores = data.val();
    const object = max(scores);
    const name = object.name.toUpperCase();
    const score = object.kills;
    if (document.getElementById('leader')){
        let leaderBoard = document.getElementById('leader');
        leaderBoard.innerText = `${name} | ${score}`;
    }
}

function max(objects){
    const arr = Object.values(objects);
    let max;
    arr.forEach(obj => {
        if(max === undefined || obj.kills > max.kills){
            max = obj;
        }
    })
    return max;
}
let handler;
window.play = play;
function play(){
    gameOver = false;
    kills = 0;
    document.getElementById("start-modal").style.display="none";
    document.getElementById('game-over-modal').style.display="none";

    handler = setInterval(spawnEnemy, 2000);
}

let bullets = [];
function over(){
    gameOver = true;
    enemies.forEach(enemy => scene.remove(enemy));
    enemies = [];
    bullets.forEach(bullet => scene.remove(bullet));
    bullets = [];
    clearInterval(handler);
    camera.position.set (0, player.height, -5);
    document.getElementById('game-over-modal').style.display="flex";
    
}

window.handleSubmit = handleSubmit;
function handleSubmit(name){
    
    const nameSubmitted = name.value;
    debugger
    ref.push({name: nameSubmitted, kills: kills});
    document.getElementById("start-modal").style.display="flex";
    kills = 0;
}

window.cancel = cancel;
function cancel(){
    gameOver = true;
    kills = 0;
    document.getElementById("start-modal").style.display="flex";
    document.getElementById('game-over-modal').style.display="none";
}

const update = function() {

    if (document.getElementById('kills')){
        let scoreClass = document.getElementById('kills')
        scoreClass.innerText = `Kills: ${kills}`

    }

    enemies.forEach((enemy, idx) => {
            if(Math.floor(enemy.position['x']) === Math.floor(camera.position['x']) && Math.floor(enemy.position['z']) === Math.floor(camera.position['z'])){
                gameOver = true;
                over();
            }
            ['x','z'].forEach(dir =>{
                if (enemy.position[dir] > camera.position[dir]){
                    enemy.position[dir] -= enemy.speed;
                };
                if (enemy.position[dir] < camera.position[dir]){
                    enemy.position[dir] += enemy.speed;
                }
            })

            bullets.forEach(bullet => {
                if((Math.floor(enemy.position['x']) === (Math.floor(bullet.position['x'])) || (Math.floor(enemy.position['x'] === Math.floor(bullet.position['x'] + 1))) || (Math.floor(enemy.position['x'] === Math.floor(bullet.position['x'] - 1)))) && 
                (Math.floor(enemy.position['z']) === Math.floor(bullet.position['z']) || (Math.floor(enemy.position['z']) === Math.floor(enemy.position['z'] + 1)) || (Math.floor(enemy.position['z'] - 1)))){
                    bullet.alive = false;
                    scene.remove(bullet)
                    scene.remove(enemy);
                    enemies.splice(idx, 1);
                    kills += 1;
                    console.log(kills);
                }   
            })
            enemy.rotation.set(
                camera.rotation.x,
                camera.rotation.y,
                camera.rotation.z
            )
    })
    bullets.forEach(bullet => {
        if (bullet.position['x'] > 21 || bullet.position['x'] < -21 || bullet.position['z'] > 21 || bullet.position['z'] < -21){
            scene.remove(bullet)
        }
    })
}

function canMove(camera, num){
    if (gameOver){
        return false;
    }
    if (num === 87){
        if((camera.position.x - Math.sin(camera.rotation.y) * player.speed > 21 || camera.position.x - Math.sin(camera.rotation.y) * player.speed < -21)
        || (camera.position.z - -Math.cos(camera.rotation.y) * player.speed > 21 || camera.position.z - -Math.cos(camera.rotation.y) * player.speed < -21 )
        || ((Math.floor(camera.position.z - -Math.cos(camera.rotation.y) * player.speed) === -7 || Math.floor(camera.position.z - -Math.cos(camera.rotation.y) * player.speed) === -5) && camera.position.x - Math.sin(camera.rotation.y) * player.speed > 5)
        || ((Math.floor(camera.position.z - -Math.cos(camera.rotation.y) * player.speed) === -7 || Math.floor(camera.position.z - -Math.cos(camera.rotation.y) * player.speed) === -5) && camera.position.x - Math.sin(camera.rotation.y) * player.speed < -5)
        || ((Math.floor(camera.position.z - -Math.cos(camera.rotation.y) * player.speed) === 7 || Math.floor(camera.position.z - -Math.cos(camera.rotation.y) * player.speed) === 5) && camera.position.x - Math.sin(camera.rotation.y) * player.speed > 5)
        || ((Math.floor(camera.position.z - -Math.cos(camera.rotation.y) * player.speed) === 7 || Math.floor(camera.position.z - -Math.cos(camera.rotation.y) * player.speed) === 5) && camera.position.x - Math.sin(camera.rotation.y) * player.speed < -5)
        || ((Math.floor(camera.position.x - Math.sin(camera.rotation.y) * player.speed) === 7 || Math.floor(camera.position.x - Math.sin(camera.rotation.y) * player.speed) === 5) && camera.position.z - -Math.cos(camera.rotation.y) * player.speed > 19)
        || ((Math.floor(camera.position.x - Math.sin(camera.rotation.y) * player.speed) === 7 || Math.floor(camera.position.x - Math.sin(camera.rotation.y) * player.speed) === 5) && camera.position.z - -Math.cos(camera.rotation.y) * player.speed < -19)
        || ((Math.floor(camera.position.x - Math.sin(camera.rotation.y) * player.speed) === -5 || Math.floor(camera.position.x - Math.sin(camera.rotation.y) * player.speed) === -7 )&& camera.position.z - -Math.cos(camera.rotation.y) * player.speed > 19)
        || ((Math.floor(camera.position.x - Math.sin(camera.rotation.y) * player.speed) === -5 || Math.floor(camera.position.x - Math.sin(camera.rotation.y) * player.speed) === -8 )&& camera.position.z - -Math.cos(camera.rotation.y) * player.speed < -19)
        || ((Math.floor(camera.position.x - Math.sin(camera.rotation.y) * player.speed) === -5 || Math.floor(camera.position.x - Math.sin(camera.rotation.y) * player.speed) === -7 )&& (camera.position.z - -Math.cos(camera.rotation.y) * player.speed > 6 && camera.position.z - -Math.cos(camera.rotation.y) * player.speed < 15))
        || ((Math.floor(camera.position.x - Math.sin(camera.rotation.y) * player.speed) === -5 || Math.floor(camera.position.x - Math.sin(camera.rotation.y) * player.speed) === -8 )&& (camera.position.z - -Math.cos(camera.rotation.y) * player.speed < -6 && camera.position.z - -Math.cos(camera.rotation.y) * player.speed > -15))
        || ((Math.floor(camera.position.x - Math.sin(camera.rotation.y) * player.speed) === 5 || Math.floor(camera.position.x - Math.sin(camera.rotation.y) * player.speed) === 7) && (camera.position.z - -Math.cos(camera.rotation.y) * player.speed > 6 && camera.position.z - -Math.cos(camera.rotation.y) * player.speed < 15))
        || ((Math.floor(camera.position.x - Math.sin(camera.rotation.y) * player.speed) === 5 || Math.floor(camera.position.x - Math.sin(camera.rotation.y) * player.speed) === 7) && (camera.position.z - -Math.cos(camera.rotation.y) * player.speed < -6 && camera.position.z - -Math.cos(camera.rotation.y) * player.speed > -15))
        
        ){
            return false;
        }
       
    }else if(num === 83){
        if((camera.position.x + Math.sin(camera.rotation.y) * player.speed > 21 || camera.position.x + Math.sin(camera.rotation.y) * player.speed < -21)
        || (camera.position.z + -Math.cos(camera.rotation.y) * player.speed > 21 || camera.position.z + -Math.cos(camera.rotation.y) * player.speed < -21)
        || ((Math.floor(camera.position.z + -Math.cos(camera.rotation.y) * player.speed) === -7 || Math.floor(camera.position.z + -Math.cos(camera.rotation.y) * player.speed) === -5) && camera.position.x + Math.sin(camera.rotation.y) * player.speed > 4)
        || ((Math.floor(camera.position.z + -Math.cos(camera.rotation.y) * player.speed) === -7 || Math.floor(camera.position.z + -Math.cos(camera.rotation.y) * player.speed) === -5) && camera.position.x + Math.sin(camera.rotation.y) * player.speed < -4)
        || ((Math.floor(camera.position.z + -Math.cos(camera.rotation.y) * player.speed) === 7 || Math.floor(camera.position.z + -Math.cos(camera.rotation.y) * player.speed) === 5) && camera.position.x + Math.sin(camera.rotation.y) * player.speed > 4)
        || ((Math.floor(camera.position.z + -Math.cos(camera.rotation.y) * player.speed) === 7 || Math.floor(camera.position.z + -Math.cos(camera.rotation.y) * player.speed) === 5) && camera.position.x + Math.sin(camera.rotation.y) * player.speed < -4)
        || ((Math.floor(camera.position.x + Math.sin(camera.rotation.y) * player.speed) === 7 || Math.floor(camera.position.x + Math.sin(camera.rotation.y) * player.speed) === 5) && camera.position.z + -Math.cos(camera.rotation.y) * player.speed > 19)
        || ((Math.floor(camera.position.x + Math.sin(camera.rotation.y) * player.speed) === 7 || Math.floor(camera.position.x + Math.sin(camera.rotation.y) * player.speed) === 5) && camera.position.z + -Math.cos(camera.rotation.y) * player.speed < -19)
        || ((Math.floor(camera.position.x + Math.sin(camera.rotation.y) * player.speed) === -5 || Math.floor(camera.position.x + Math.sin(camera.rotation.y) * player.speed) === -7) && camera.position.z + -Math.cos(camera.rotation.y) * player.speed > 19)
        || ((Math.floor(camera.position.x + Math.sin(camera.rotation.y) * player.speed) === -5 || Math.floor(camera.position.x + Math.sin(camera.rotation.y) * player.speed) === -8) && camera.position.z + -Math.cos(camera.rotation.y) * player.speed < -19)
        || ((Math.floor(camera.position.x + Math.sin(camera.rotation.y) * player.speed) === -5 || Math.floor(camera.position.x + Math.sin(camera.rotation.y) * player.speed) === -7) && (camera.position.z + -Math.cos(camera.rotation.y) * player.speed > 6 && camera.position.z + -Math.cos(camera.rotation.y) * player.speed < 15))
        || ((Math.floor(camera.position.x + Math.sin(camera.rotation.y) * player.speed) === -5 || Math.floor(camera.position.x + Math.sin(camera.rotation.y) * player.speed) === -8) && (camera.position.z + -Math.cos(camera.rotation.y) * player.speed < -6 && camera.position.z + -Math.cos(camera.rotation.y) * player.speed > -15))
        || ((Math.floor(camera.position.x + Math.sin(camera.rotation.y) * player.speed) === 5 || Math.floor(camera.position.x + Math.sin(camera.rotation.y) * player.speed) === 7) && (camera.position.z + -Math.cos(camera.rotation.y) * player.speed > 6 && camera.position.z + -Math.cos(camera.rotation.y) * player.speed < 15))
        || ((Math.floor(camera.position.x + Math.sin(camera.rotation.y) * player.speed) === 5 || Math.floor(camera.position.x + Math.sin(camera.rotation.y) * player.speed) === 7) && (camera.position.z + -Math.cos(camera.rotation.y) * player.speed < -6 && camera.position.z + -Math.cos(camera.rotation.y) * player.speed > -15))
        ){
            return false;
        }
        
    }else if(num === 65){
        if ((camera.position.x + Math.sin(camera.rotation.y + Math.PI / 2) * player.speed > 21 || camera.position.x + Math.sin(camera.rotation.y + Math.PI / 2) * player.speed < -21)
        || (camera.position.z + -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed > 21 || camera.position.z + -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed < -21)
        || ((Math.floor(camera.position.z + -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed ) === -7 || Math.floor(camera.position.z + -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed ) === -5) && camera.position.x + Math.sin(camera.rotation.y + Math.PI / 2) * player.speed > 4)
        || ((Math.floor(camera.position.z + -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed ) === -7 || Math.floor(camera.position.z + -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed ) === -5) && camera.position.x + Math.sin(camera.rotation.y + Math.PI / 2) * player.speed < -4)
        || ((Math.floor(camera.position.z + -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed ) === 7 || Math.floor(camera.position.z + -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed ) === 5) && camera.position.x + Math.sin(camera.rotation.y + Math.PI / 2) * player.speed > 4)
        || ((Math.floor(camera.position.z + -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed ) === 7 || Math.floor(camera.position.z + -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed ) === 5) && camera.position.x + Math.sin(camera.rotation.y + Math.PI / 2) * player.speed < -4)
        || ((Math.floor(camera.position.x + Math.sin(camera.rotation.y + Math.PI / 2) * player.speed) === 7 || Math.floor(camera.position.x + Math.sin(camera.rotation.y + Math.PI / 2) * player.speed) === 5) && camera.position.z + -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed > 19)
        || ((Math.floor(camera.position.x + Math.sin(camera.rotation.y + Math.PI / 2) * player.speed) === 7 || Math.floor(camera.position.x + Math.sin(camera.rotation.y + Math.PI / 2) * player.speed) === 5) && camera.position.z + -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed < -19)
        || ((Math.floor(camera.position.x + Math.sin(camera.rotation.y + Math.PI / 2) * player.speed) === -5 || Math.floor(camera.position.x + Math.sin(camera.rotation.y + Math.PI / 2) * player.speed) === -7) && camera.position.z + -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed > 19)
        || ((Math.floor(camera.position.x + Math.sin(camera.rotation.y + Math.PI / 2) * player.speed) === -5 || Math.floor(camera.position.x + Math.sin(camera.rotation.y + Math.PI / 2) * player.speed) === -8) && camera.position.z + -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed < -19)
        || ((Math.floor(camera.position.x + Math.sin(camera.rotation.y + Math.PI / 2) * player.speed) === -5 || Math.floor(camera.position.x + Math.sin(camera.rotation.y + Math.PI / 2) * player.speed) === -7) && (camera.position.z + -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed > 6 && camera.position.z + -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed < 15))
        || ((Math.floor(camera.position.x + Math.sin(camera.rotation.y + Math.PI / 2) * player.speed) === -5 || Math.floor(camera.position.x + Math.sin(camera.rotation.y + Math.PI / 2) * player.speed) === -8) && (camera.position.z + -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed < -6 && camera.position.z + -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed > -15))
        || ((Math.floor(camera.position.x + Math.sin(camera.rotation.y + Math.PI / 2) * player.speed) === 5 || Math.floor(camera.position.x + Math.sin(camera.rotation.y + Math.PI / 2) * player.speed) === 7) && (camera.position.z + -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed > 6 && camera.position.z + -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed < 15))
        || ((Math.floor(camera.position.x + Math.sin(camera.rotation.y + Math.PI / 2) * player.speed) === 5 || Math.floor(camera.position.x + Math.sin(camera.rotation.y + Math.PI / 2) * player.speed) === 7) && (camera.position.z + -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed < -6 && camera.position.z + -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed > -15))
        ){
            return false;
        }
       
    }else if(num === 68){
        if ((camera.position.x + Math.sin(camera.rotation.y - Math.PI / 2) * player.speed > 21 || camera.position.x + Math.sin(camera.rotation.y - Math.PI / 2) * player.speed < -21)
        || (camera.position.z + -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed > 21 || camera.position.z + -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed < -21)
        || ((Math.floor(camera.position.z + -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed) === -7 || Math.floor(camera.position.z + -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed) === -5)&& camera.position.x + Math.sin(camera.rotation.y - Math.PI / 2) * player.speed > 4)
        || ((Math.floor(camera.position.z + -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed) === -7 || Math.floor(camera.position.z + -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed) === -5)&& camera.position.x + Math.sin(camera.rotation.y - Math.PI / 2) * player.speed < -4)
        || ((Math.floor(camera.position.z + -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed) === 7 || Math.floor(camera.position.z + -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed) === 5) && camera.position.x + Math.sin(camera.rotation.y - Math.PI / 2) * player.speed > 4)
        || ((Math.floor(camera.position.z + -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed) === 7 || Math.floor(camera.position.z + -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed) === 5) && camera.position.x + Math.sin(camera.rotation.y - Math.PI / 2) * player.speed < -4)
        || ((Math.floor(camera.position.x + Math.sin(camera.rotation.y - Math.PI / 2) * player.speed) === 7 || Math.floor(camera.position.x + Math.sin(camera.rotation.y - Math.PI / 2) * player.speed) === 5) && camera.position.z + -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed > 19)
        || ((Math.floor(camera.position.x + Math.sin(camera.rotation.y - Math.PI / 2) * player.speed) === 7 || Math.floor(camera.position.x + Math.sin(camera.rotation.y - Math.PI / 2) * player.speed) === 5) && camera.position.z + -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed < -19)
        || ((Math.floor(camera.position.x + Math.sin(camera.rotation.y - Math.PI / 2) * player.speed) === -5 || Math.floor(camera.position.x + Math.sin(camera.rotation.y - Math.PI / 2) * player.speed) === -7) && camera.position.z + -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed > 19)
        || ((Math.floor(camera.position.x + Math.sin(camera.rotation.y - Math.PI / 2) * player.speed) === -5 || Math.floor(camera.position.x + Math.sin(camera.rotation.y - Math.PI / 2) * player.speed) === -8) && camera.position.z + -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed < -19)
        || ((Math.floor(camera.position.x + Math.sin(camera.rotation.y - Math.PI / 2) * player.speed) === -5 || Math.floor(camera.position.x + Math.sin(camera.rotation.y - Math.PI / 2) * player.speed) === -7) && (camera.position.z + -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed > 6 && camera.position.z + -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed < 15))
        || ((Math.floor(camera.position.x + Math.sin(camera.rotation.y - Math.PI / 2) * player.speed) === -5 || Math.floor(camera.position.x + Math.sin(camera.rotation.y - Math.PI / 2) * player.speed) === -8) && (camera.position.z + -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed < -6 && camera.position.z + -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed > -15))
        || ((Math.floor(camera.position.x + Math.sin(camera.rotation.y - Math.PI / 2) * player.speed) === 5 || Math.floor(camera.position.x + Math.sin(camera.rotation.y - Math.PI / 2) * player.speed) === 7) && (camera.position.z + -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed > 6 && camera.position.z + -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed < 15))
        || ((Math.floor(camera.position.x + Math.sin(camera.rotation.y - Math.PI / 2) * player.speed) === 5 || Math.floor(camera.position.x + Math.sin(camera.rotation.y - Math.PI / 2) * player.speed) === 7) && (camera.position.z + -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed < -6 && camera.position.z + -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed > -15))
        ){
            return false;
        }
       
    }

    return true;
    
}



function render() {
    const time = Date.now() * 0.0005;
    const delta = clock.getDelta();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
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
    


    if((keyboard[32] && player.canShoot <=0) && gameOver === false ){
        let bullet = new THREE.Mesh( 
            new THREE.SphereGeometry(0.1, 6, 32, ),
            new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: false})
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
        scene.add(bullet);
        player.canShoot = 10;
    }

    if (player.canShoot > 0){
        player.canShoot -= 1;
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