import * as THREE from 'three';

export type AllModels = Vertex | Fragment | Toon | Shockwave | ShockToon;
export type ColorHex = string;

export interface Vertex {
    type: 'vertex';
    color: ColorHex,
    scale: number;
    // NUEVOS PARÁMETROS REQUERIDOS
    Smoothness: number;  // Controla frecuencia de la onda
    Hardness: number;    // Controla amplitud de la onda
}

export interface Fragment{
    type: 'fragment';
    
    luzX: number;
    luzY: number;
    luzZ: number;

    scale: number;
    colorSpecular: ColorHex;
    lightColor: ColorHex;
    meshColor: ColorHex;
    shininess: number
}

export interface Toon{
    type: 'toon';
    scale: number;
    colorObject: ColorHex;
    
    luzX: number;
    luzY: number;
    luzZ: number;

    stepHigh: number;
    stepMid: number;
    stepLow: number;
                
    colorHigh: ColorHex; 
    colorMid: ColorHex;
    colorLow: ColorHex;

    softness: number;   
    specularColor: ColorHex; 
    shininess: number;
    specularStep: number;

    outlineThickness: number;
    outlineColor: ColorHex;
}

export interface Shockwave{
    type: 'shockwave';
    scale: number;
    colorObject: ColorHex;
    velocity: number;
    frequency: number;
    amplitude: number;
}

export interface ShockToon{
    type: 'shocktoon';
    scale: number;
    colorObject: ColorHex;

    velocity: number;
    frequency: number;
    amplitude: number;

    luzX: number;
    luzY: number;
    luzZ: number;

    stepHigh: number;
    stepMid: number;
    stepLow: number;
                
    colorHigh: ColorHex; 
    colorMid: ColorHex;
    colorLow: ColorHex;

    softness: number;   
    specularColor: ColorHex; 
    shininess: number;
    specularStep: number;

    outlineThickness: number;
    outlineColor: ColorHex;
}