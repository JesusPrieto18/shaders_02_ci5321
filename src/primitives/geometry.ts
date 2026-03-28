import * as THREE from 'three';
import vs from '../shaders/vertex_1.glsl?raw';
import fs from '../shaders/fragment_1.glsl?raw';
import { camera } from '../config/config';
import { addModel } from './modelsMesh';

/** 
export function ShockFragmentToon(name: string) {
    const geometry = new THREE.PlaneGeometry(5, 5, 128, 128);

    geometry.rotateX(-Math.PI / 2); // Girar para que quede horizontal
    //geometry.computeVertexNormals(); // Necesario para que el fragment shader tenga normales y se vea la iluminación
    const material = new THREE.RawShaderMaterial({
        vertexShader: vs6,
        fragmentShader: fs3,
        glslVersion: THREE.GLSL3,
        uniforms: {
            projectionMatrix: { value: camera.projectionMatrix },
            viewMatrix: { value: camera.matrixWorldInverse },
            modelMatrix: { value: new THREE.Matrix4() },
            
            uFrequency: { value: 4.0 },
            uVelocity: { value: 2.0 },
            uAmplitude: { value: 2.0 },

            uViewPos: { value: camera.position }, // NUEVO: La posición de la cámara a prueba de fallos

            uLightPos: { value: new THREE.Vector3(0,0,1) }, // Una "bombilla" arriba a la derecha
            uLightColor: { value: new THREE.Color(1.0, 1.0, 1.0) }, // Luz Blanca
            uObjectColor: { value: new THREE.Color('#10047c') },

            // Rangos de los degradados
            uStepHigh: { value: 0.8 },
            uStepMid: { value: 0.5 },
            uStepLow: { value: 0.2 },
            
            // Colores de cada sección (usamos THREE.Color para facilidad)
            uColorHigh: { value: new THREE.Color('#303df1e8') }, // Rojo brillante
            uColorMid: { value: new THREE.Color('#116af0') },  // Rojo medio
            uColorLow: { value: new THREE.Color(0.3, 0.0, 0.0) },  // Rojo oscuro / vino
            
            uSoftness: { value: 0.02 },

            // Parámetros de brillo
            uSpecularColor: { value: new THREE.Color(1.0, 1.0, 1.0) }, // Brillo blanco
            uShininess: { value: 32.0 },
            uSpecularStep: { value: 0.5 }, // Qué tan concentrado es el punto de luz
            
            uOutlineThickness: { value: 0.25 }, // Ajusta este número de 0.1 a 0.5 para el grosor
            uOutlineColor: { value: new THREE.Color('#000000') }, // Tinta negra
            uTime: { value: 0.0 },
        }, 
        side: THREE.FrontSide
    });

    addModel(name, geometry, material, {
        type: 'shocktoon',
        scale: 1,
        colorObject: '#10047c',
        velocity: 2.0,
        frequency: 4.0,
        amplitude: 2.0,
        
        luzX: 0.0,
        luzY: 0.0,
        luzZ: 5.0,

        stepHigh: 0.8,
        stepMid: 0.5,
        stepLow: 0.2,
                    
        colorHigh: '#303df1e8', 
        colorMid: '#116af0',
        colorLow: '#03c0f0',
        
        softness: 0.02 ,
        specularColor: '#ffffff', 
        shininess: 32.0,
        specularStep: 0.5,

        outlineColor: '#000000',
        outlineThickness: 0.25
    });
}
*/

export function TornadoParticles(name: string) {
    const particleCount = 50000; // ¡50 mil partículas de un solo golpe!
    
    
    const positions = new Float32Array(particleCount * 3);

    for(let i = 0; i < particleCount; i++) {
        // Columna 1: RADIO (Distancia desde el centro)
        // Usamos Math.random() para distribuirlas, evitando que el radio sea exactamente 0
        positions[i * 3 + 0] = Math.random() * 2.0 + 0.1; 
        
        // Columna 2: ALTURA (Posición vertical)
        // Las distribuimos aleatoriamente desde el suelo (0) hasta la altura máxima (ej. 10)
        positions[i * 3 + 1] = Math.random() * 10.0; 
        
        // Columna 3: ÁNGULO (En radianes)
        // Un círculo completo tiene 2 * PI radianes (360 grados)
        positions[i * 3 + 2] = Math.random() * Math.PI * 2.0; 
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.RawShaderMaterial({
        vertexShader: vs,
        fragmentShader: fs,
        glslVersion: THREE.GLSL3,
        transparent: true,
        depthWrite: false, // CRÍTICO: Evita que los bordes cuadrados de las partículas bloqueen a las que están detrás
        blending: THREE.AdditiveBlending, // Las luces de las partículas se suman, creando brillos
        uniforms: {
            projectionMatrix: { value: camera.projectionMatrix },
            viewMatrix: { value: camera.matrixWorldInverse },
            modelMatrix: { value: new THREE.Matrix4() }, // Se enlazará en ModelsMesh
            
            uTime: { value: 0.0 }, // El motor que mueve todo
            uColor: { value: new THREE.Color('#00ffff') }, // Cyan eléctrico
            uSize: { value: 8.0 },
            uSpeed: { value: 3.0 },
            uUpSpeed: { value: 1.5 },
            uMaxHeight: { value: 10.0 }
        }
    });

    const particles = new THREE.Points(geometry, material);
    

    addModel(name, particles, material, {
        type: 'tornado',
        scale: 1,
        colorObject: '#00ffff',
        size: 8.0,
        speed: 3.0,
        upSpeed: 1.5
    });
}