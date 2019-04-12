export default class Enemy {
    constructor(pos) {
        // const geometry = new THREE.SphereBufferGeometry(1, 16, 16);
        // // const material = new THREE.MeshBasicMaterial({ color: 0x800000, wireframe: true});
        // const geometry = new THREE.TextureLoader().load("images/swat-soldier-vs-zombies-isometric-2d-sprites/Zombie_male/Thumbs.db");
        // const material = new THREE.SpriteMaterial( { map: geometry, color: 0xfffff0 } );
        // const zombie = new THREE.Sprite(material);


        const spriteMap = new THREE.TextureLoader().load("images/swat-soldier-vs-zombies-isometric-2d-sprites/Zombie_male/zombie_male_dead_v01_01.png");
        const spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap, color: 0xffffff });
        const zombie = new THREE.Sprite(spriteMaterial);
        zombie.scale['x'] = 5
        zombie.scale['y'] = 5
        zombie.scale['z'] = 5
        // zombie.rotation.set(10,0,1)
        // zombie.rotation['y'] = 3000000
        zombie.rotation.x = Math.PI / 2
        zombie.rotation.y = Math.PI / 2
        zombie.rotation.z = Math.PI / 2
        // zombie.rotateY(180)
        // zombie.rotateZ(180)
        zombie.position.setX(pos.x)
        zombie.position.setY(pos.y)
        zombie.position.setZ(pos.z)
        return zombie;
    }
}