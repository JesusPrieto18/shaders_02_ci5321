import * as THREE from 'three';
import GUI from 'lil-gui';
import { scene } from '../config/config';
import {AllModels, ColorHex, Tornado} from './models';

const gui = new GUI();
gui.title('Controles del Modelo');

export const models: ModelsMesh<AllModels>[] = [];
export let indiceActivo = 0;

export class ModelsMesh<T extends AllModels> {
  protected name: string;
  protected shader: THREE.RawShaderMaterial;
  protected mesh: THREE.Object3D;
  protected parameters: T
  protected fileGUI: GUI;
    
  constructor(name: string, geometry: THREE.BufferGeometry | THREE.Group | THREE.Points, shader: THREE.RawShaderMaterial, parameters: T) {
    this.parameters = parameters;
    this.name = name;
    
    // 1. Crear el material y la malla
    // Usamos MeshStandardMaterial para poder cambiar el color y que reaccione a luces
    this.shader = shader;

    if (geometry instanceof THREE.BufferGeometry) {
        this.mesh = new THREE.Mesh(geometry, this.shader);
    } else {
        this.mesh = geometry; // Si es un Group o Points, lo usamos directamente
    }

    this.fileGUI = gui.addFolder(this.name);
  }

  protected forEachObject(callback: (object: THREE.Object3D | any) => void): void {
    this.mesh.traverse((child: any) => {
        // Type guard de Three.js para saber si es un Mesh
        if (child.isMesh || child.isPoints) {
            callback(child);
        }
    });
  }
  protected buildGUI(): void {
    console.warn(`buildGUI no implementado para ${this.name}`);
  }

  public getNombre(): string {
    return this.name;
  }

  public show() {
    this.mesh.visible = true;
    this.fileGUI.show(); // lil-gui permite ocultar carpetas enteras
  }

  public hide() {
    this.mesh.visible = false;
    this.fileGUI.hide();
  }

  public add() {
    scene.add(this.mesh);
  }

}

export class TornadoModel extends ModelsMesh<Tornado> {
  constructor(name: string, geometry: THREE.BufferGeometry | THREE.Group, shader: THREE.RawShaderMaterial, params: Tornado) {
    super(name, geometry, shader, params);
    this.mesh.name = "tornado"
    this.buildGUI();
  }
  protected buildGUI(): void {

    this.fileGUI.addColor(this.parameters, 'colorObject').name("Color").onChange((nuevoHex: ColorHex) => {
      this.shader.uniforms.uColor.value.set(nuevoHex);
    });

    this.fileGUI.add(this.parameters, 'scale', 0.1, 5.0).name('Escala Global').onChange((v: number) => {
      // scale.set(x, y, z) escala uniformemente en todos los ejes
      this.mesh.scale.set(v, v, v);
    });

    this.fileGUI.add(this.parameters, 'size', 0.1, 5.0).name('Tamaño de Partícula').onChange((v: number) => {
        this.shader.uniforms.uSize.value = v; // ¡Actualizamos la GPU!
    });

    this.fileGUI.add(this.parameters, 'speed', 0.1, 10.0).name('Velocidad de Giro').onChange((v: number) => {
        this.shader.uniforms.uSpeed.value = v; // ¡Actualizamos la GPU!
    });

    this.fileGUI.add(this.parameters, 'upSpeed', 0.1, 10.0).name('Velocidad de Ascenso').onChange((v: number) => {
        this.shader.uniforms.uUpSpeed.value = v; // ¡Actualizamos la GPU!
    });

    const carpetaForma = this.fileGUI.addFolder('Forma del Tornado');
    carpetaForma.add(this.parameters, 'radiusBottom', 0.0, 5.0).name('Radio Inferior').onChange((v: number) => {
        this.shader.uniforms.uRadiusBottom.value = v;
    });
    carpetaForma.add(this.parameters, 'radiusTop', 1.0, 15.0).name('Radio Superior').onChange((v: number) => {
        this.shader.uniforms.uRadiusTop.value = v;
    });
    carpetaForma.add(this.parameters, 'turbulence', 0.0, 5.0).name('Turbulencia (Caos)').onChange((v: number) => {
        this.shader.uniforms.uTurbulence.value = v;
    });

    console.log('Construyendo modelo tipo tornado');
  }
}

/** 
export class ShockToonModel extends ModelsMesh<ShockToon> {
  constructor(name: string, geometry: THREE.BufferGeometry | THREE.Group, shader: THREE.RawShaderMaterial, params: ShockToon) {
    super(name, geometry, shader, params);
    this.mesh.name = "shocktoon"
    this.buildGUI();

  }

  protected buildGUI(): void {

    this.fileGUI.addColor(this.parameters, 'colorObject').name("Color").onChange((nuevoHex: ColorHex) => {
      this.shader.uniforms.uObjectColor.value.set(nuevoHex);
    });

    this.fileGUI.add(this.parameters, 'scale', 0.1, 5.0).name('Escala Global').onChange((v: number) => {
      // scale.set(x, y, z) escala uniformemente en todos los ejes
      this.mesh.scale.set(v, v, v);
    });

    this.fileGUI.add(this.parameters, 'velocity', 0.1, 10.0).name('Velocidad').onChange((v: number) => {
        this.shader.uniforms.uVelocity.value = v; // ¡Actualizamos la GPU!
    });

    this.fileGUI.add(this.parameters, 'frequency', 0.1, 20.0).name('Frecuencia').onChange((v: number) => {
        this.shader.uniforms.uFrequency.value = v; // ¡Actualizamos la GPU!
    });
    this.fileGUI.add(this.parameters, 'amplitude', 0.1, 5.0).name('Amplitud').onChange((v: number) => {
        this.shader.uniforms.uAmplitude.value = v; // ¡Actualizamos la GPU!
    });

    this.fileGUI.add(this.parameters, 'shininess', 1, 256).name('Shininess').onChange((v: number) => {
        this.shader.uniforms.uShininess.value = v; // ¡Actualizamos la GPU!
    });

    const carpetaLuz = this.fileGUI.addFolder('Posición de la Luz');
    carpetaLuz.add(this.parameters, 'luzX', -10, 10, 1).onChange((v: number) => this.shader.uniforms.uLightPos.value.x = v);
    carpetaLuz.add(this.parameters, 'luzY', -10, 10, 1).onChange((v: number) => this.shader.uniforms.uLightPos.value.y = v);
    carpetaLuz.add(this.parameters, 'luzZ', -10, 10, 1).onChange((v: number) => this.shader.uniforms.uLightPos.value.z = v);
    
    const carpetaLuzColor = this.fileGUI.addFolder('Color de la Luz');
    carpetaLuzColor.addColor({ color: '#ffffff' }, 'color').name('Color de la Luz').onChange((nuevoHex: ColorHex) => {
        this.shader.uniforms.uLightColor.value.set(nuevoHex);
    });

    carpetaLuzColor.addColor({ color: '#ffffff' }, 'color').name('Color del Especular').onChange((nuevoHex: ColorHex) => {
        this.shader.uniforms.uSpecularColor.value.set(nuevoHex);
    });

    const carpetaBordes = this.fileGUI.addFolder('Radios de los circulos');
    carpetaBordes.add(this.parameters, 'stepHigh', 0, 1).onChange((v: number) => this.shader.uniforms.uStepHigh.value = v);
    carpetaBordes.add(this.parameters, 'stepMid', 0, 1).onChange((v: number) => this.shader.uniforms.uStepMid.value = v);
    //carpetaBordes.add(this.parameters, 'stepLow', 0, 1).onChange((v: number) => this.shader.uniforms.uStepLow.value = v);
    
    carpetaBordes.add(this.parameters, 'softness', 0, 0.1).onChange((v: number) => this.shader.uniforms.uSoftness.value = v);

    const carpetaColores = this.fileGUI.addFolder('Colores de las bandas');
    carpetaColores.addColor(this.parameters, 'colorHigh').name('Color Alto').onChange((nuevoHex: ColorHex) => {
        this.shader.uniforms.uColorHigh.value.set(nuevoHex);
    });
    carpetaColores.addColor(this.parameters, 'colorMid').name('Color Medio').onChange((nuevoHex: ColorHex) => {
        this.shader.uniforms.uColorMid.value.set(nuevoHex);
    });

    const carpetaOutline = this.fileGUI.addFolder('Contorno');
    carpetaOutline.add(this.parameters, 'outlineThickness', 0.1, 0.5).name('Grosor del Contorno').onChange((v: number) => {
        this.shader.uniforms.uOutlineThickness.value = v;
    });
    carpetaOutline.addColor(this.parameters, 'outlineColor').name('Color del Contorno').onChange((nuevoHex: ColorHex) => {
        this.shader.uniforms.uOutlineColor.value.set(nuevoHex);
    });
    console.log('Construyendo modelo tipo shockwave');
  }
}*/

export function changeModel(nuevoIndice: number) {
  if (nuevoIndice === indiceActivo) {
    console.log(`Ya estás viendo el modelo "${models[indiceActivo].getNombre()}". No se realizará ningún cambio.`);
    return; // Si ya estamos en ese modelo, no hacemos nada 
  } 
  
  if (nuevoIndice >= 0 && nuevoIndice < models.length) {
      if (models[indiceActivo]) {
          console.log(`Cambiando del modelo "${models[indiceActivo].getNombre()}" al modelo "${models[nuevoIndice].getNombre()}".`);
          console.log(`Índice activo actual: ${indiceActivo}, Nuevo índice: ${nuevoIndice}`);
          models[indiceActivo].hide();
          indiceActivo = nuevoIndice;
          models[indiceActivo].show();
      } else {
        console.warn(`Índice activo (${indiceActivo}) no corresponde a ningún modelo. Mostrando el nuevo modelo sin ocultar el anterior.`);
      }
  }
}

export function addModel(nombre: string, geometria: THREE.BufferGeometry  | THREE.Group, shader: THREE.RawShaderMaterial, parametros: AllModels) {
  let model: ModelsMesh<any>;  

  if (parametros.type === 'tornado') {
    model = new TornadoModel(nombre, geometria, shader, parametros);
  } else {
    throw new Error("Tipo de modelo no soportado");
  }

  model.add();
  models.push(model);

  if (models.length === 1) {
      // Si es el primer modelo, lo mostramos por defecto
      changeModel(0);
  } else {
      // Si no, lo ocultamos hasta que el usuario lo seleccione
      model.hide();
  }
}