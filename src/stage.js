import MTLLoader from '../js/MTLLoader';
import OBJLoader from '../js/OBJLoader';

export default class Stage {
    constructor() {
        let stage;
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
                stage = object;  
            });
        });
        // stage.scale.x = stage.scale.y = stage.scale.z = 3;
        return stage;
    }
}