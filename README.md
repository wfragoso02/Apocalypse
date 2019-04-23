# Apocalypse 


### Background and Overview
Apocalypse is a 3D first person shooter game with a survival mode objective.  The character is trapped in an apartment while being chased by zombie ghosts.  The main and only objective is to kill as many zombies as possible to survive. 
  
Try it [Live](https://wfragoso02.github.io/JS-Project/) game here.
  
    
![alt text] -- play

### Game And Controls
Zombies will chase you infinitely around the apartment until they reach you or until you shoot them.  
Use the following keys to move and shoot:

# Technologies
### Apocalypse's Architecture and Technologies: 
* Fully written in native Javascript.
* Three.js - 3D library.
* Blender - Contruction of the objects and animations.
* Firebase - Host highscores.

# Awesome Features
### Firebase
Apacalypse utilizes firebase to host highscores but the game only renders the highest score and the player's name.
  
```javascript
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
```


### Zombie Spawning
Apocalypse randomises the location and speed of the spawning zombies.
```javascript
let enemies = [];
const spawnEnemy = () => {
    const speeds = [0.1, 0.2, 0.05, 0.01];
    const coordinates = [{x:20, y: 0, z:0 }, {x:0, y: 0, z:-20},{x:-20, y: 0, z:0 },{x:0, y: 0, z:20 } ];
    const coordinate = coordinates[Math.floor(Math.random() * coordinates.length)];
    const speed = speeds[Math.floor(Math.random() * speeds.length)];
    loader.load( 'images/real-zombie.glb', function (gltf) {
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
```



