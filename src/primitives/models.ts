export type AllModels = Tornado | Explosion;
export type ColorHex = string;

export interface Tornado {
    type: 'tornado';
    scale: number;
    colorObject: ColorHex;
    size: number;    // Tamaño de la partícula
    speed: number;   // Qué tan rápido gira
    upSpeed: number; // Qué tan rápido sube
    
    radiusBottom: number;
    radiusTop: number;
    turbulence: number;
}
export interface Explosion {
    type: 'explosion';
    scale: number;
    colorObject: ColorHex;
    size: number;              // Tamaño de la partícula (uSize)
    
    // Parámetros de la explosión cíclica
    explosionForce: number;    // uExplosionForce - Fuerza de explosión
    oscillationSpeed: number; // uExplosionDuration - Duración del ciclo de explosión
    gravity: number;          // uGravity - Gravedad que atrae las partículas hacia abajo
}
