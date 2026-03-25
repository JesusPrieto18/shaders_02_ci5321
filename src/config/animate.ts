import * as THREE from 'three';
import { scene, camera, renderer, controls} from './config';

export function animate(time: number) {
    
    //controls.update();

    window.addEventListener('resize', () => {
    // 1. Actualizamos el Aspect Ratio de la cámara
    camera.aspect = window.innerWidth / window.innerHeight;
    // 2. IMPORTANTE: Recalcular las matrices de proyección de la cámara
    camera.updateProjectionMatrix(); 
    // 3. Actualizamos el tamaño del renderizador
    renderer.setSize(window.innerWidth, window.innerHeight);
    });

    scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            if (child.material instanceof THREE.RawShaderMaterial) {
                if (child.name === "shockwave" || child.name === "shocktoon") {
                    child.material.uniforms.uTime.value = time * 0.001;
                }
            }
        }
    });

    renderer.render(scene, camera);
    requestAnimationFrame(animate);

}
