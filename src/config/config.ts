import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export let scene: THREE.Scene;
export let camera: THREE.PerspectiveCamera;
export let renderer: THREE.WebGLRenderer;
export let controls: OrbitControls;

export function config() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.5, 0.5, 0.5);
    camera = new THREE.PerspectiveCamera(
    75,                                     // FOV: Campo de visión en grados (vertical)
    window.innerWidth / window.innerHeight, // Aspect Ratio: Proporción de la pantalla
    0.1,                                    // Near: Lo más cerca que la cámara puede "ver"
    1000                                    // Far: Lo más lejos que la cámara puede "ver"
    );
    camera.position.z = 5;

    const canvas = document.querySelector('#c');
    if (!(canvas instanceof HTMLCanvasElement)) {
        throw new Error("Canvas element with id 'c' not found or is not a HTMLCanvasElement.");
    }
    
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const controls = new OrbitControls(camera, renderer.domElement);

    controls.enableDamping = true;
    controls.dampingFactor = 0.05; 
    controls.minDistance = 2;
    controls.maxDistance = 20;

    //const luz = new THREE.DirectionalLight(0xffffff, 1);
    //luz.position.set(2, 2, 5);
    //scene.add(luz, new THREE.AmbientLight(0xffffff, 0.2));
}