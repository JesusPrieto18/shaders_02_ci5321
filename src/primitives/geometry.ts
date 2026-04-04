import * as THREE from 'three';
import vs from '../shaders/vertex_1.glsl?raw';
import fs from '../shaders/fragment_1.glsl?raw';
import vse from '../shaders/vertex_explosion.glsl?raw';
import fse from '../shaders/fragment_explosion.glsl?raw';
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
    const randomness = new Float32Array(particleCount * 3);

    for(let i = 0; i < particleCount; i++) {
        // 1. POSICIONES
        // TRUCO PRO: Al usar Math.sqrt() en el radio, las partículas se distribuyen 
        // uniformemente en el área del círculo en lugar de agruparse en el centro.
        // Aquí solo guardamos un porcentaje del radio (0.0 a 1.0)
        positions[i * 3 + 0] = Math.sqrt(Math.random()); 
        positions[i * 3 + 1] = Math.random() * 10.0; 
        positions[i * 3 + 2] = Math.random() * Math.PI * 2.0; 

        // 2. CAOS (Randomness)
        // Generamos un vector 3D aleatorio entre -1.0 y 1.0 para cada partícula
        randomness[i * 3 + 0] = (Math.random() - 0.5) * 2.0; // Desfase en X
        randomness[i * 3 + 1] = (Math.random() - 0.5) * 2.0; // Desfase en Y
        randomness[i * 3 + 2] = (Math.random() - 0.5) * 2.0; // Desfase en Z
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3));

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
            uMaxHeight: { value: 10.0 },
        
            uRadiusBottom: { value: 1.0 },
            uRadiusTop: { value: 5.0 },
            uTurbulence: { value: 1.5 } // Qué tan fuerte es el caos
        }
    });

    const particles = new THREE.Points(geometry, material);
    

    addModel(name, particles, material, {
        type: 'tornado',
        scale: 1,
        colorObject: '#00ffff',
        size: 8.0,
        speed: 3.0,
        upSpeed: 1.5,
        radiusBottom: 1.0,
        radiusTop: 5.0,
        turbulence: 1.5
    });
};

export function ExplosionParticles(name: string) {
    const particleCount = 5000; // ¡50 mil partículas de un solo golpe!
    
    const positions = new Float32Array(particleCount * 3);
    const randomness = new Float32Array(particleCount * 3);

    for(let i = 0; i < particleCount; i++) {
        // 1. POSICIONES
        // Aquí el radio se distribuye uniformemente en la esfera usando Math.cbrt() para el efecto de explosión
        const radius = Math.cbrt(Math.random()) * 5.0; // Radio máximo de 5 unidades
        const theta = Math.random() * Math.PI * 2.0; // Ángulo horizontal
        const phi = Math.acos(2.0 * Math.random() - 1.0); // Ángulo vertical (distribución esférica)

        positions[i * 3 + 0] = radius * Math.sin(phi) * Math.cos(theta); // X
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta); // Y
        positions[i * 3 + 2] = radius * Math.cos(phi); // Z

        // 2. CAOS (Randomness)
        randomness[i * 3 + 0] = (Math.random() - 0.5) * 2.0; // Desfase en X
        randomness[i * 3 + 1] = (Math.random() - 0.5) * 2.0; // Desfase en Y
        randomness[i * 3 + 2] = (Math.random() - 0.5) * 2.0; // Desfase en Z
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3));

    const material = new THREE.RawShaderMaterial({
        vertexShader: vse,
        fragmentShader: fse,
        glslVersion: THREE.GLSL3,
        transparent: true,
        depthWrite: false, // Evita que las partículas bloqueen a las que están detrás
        blending: THREE.AdditiveBlending, // Las luces de las partículas se suman, creando brillos
        uniforms: {
            projectionMatrix: { value: camera.projectionMatrix },
            viewMatrix: { value: camera.matrixWorldInverse },
            modelMatrix: { value: new THREE.Matrix4() }, // Se enlazará en ModelsMesh
            
            uTime: { value: 0.0 }, // El motor que mueve todo
            uColor: { value: new THREE.Color('#ff6600') }, // Naranja brillante para el centro
            uSize: { value: 5.0 },
            uExplosionForce: { value: 1.0 },
            uOscillationSpeed: { value: 0.2 },
            uGravity: { value: 9.8 },
        }
    });

    const particles = new THREE.Points(geometry, material);
    
    addModel(name, particles, material, {
        type: 'explosion',
        scale: 1,
        colorObject: '#ff6600',
        size: 5.0,
        explosionForce: 1.0,
        oscillationSpeed: 0.2,
        gravity: 9.8,

    });
};