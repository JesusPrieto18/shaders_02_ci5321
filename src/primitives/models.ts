export type AllModels = Tornado;
export type ColorHex = string;

export interface Tornado {
    type: 'tornado';
    scale: number;
    colorObject: ColorHex;
    size: number;    // Tamaño de la partícula
    speed: number;   // Qué tan rápido gira
    upSpeed: number; // Qué tan rápido sube
}