export default class Enemy {
    constructor(pos) {
        const geometry = new THREE.SphereBufferGeometry(1, 16, 16);
        const material = new THREE.MeshBasicMaterial({ color: 0xfffff0 });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.setX(pos.x)
        sphere.position.setY(pos.y)
        sphere.position.setZ(pos.z)
        return sphere;
    }
}