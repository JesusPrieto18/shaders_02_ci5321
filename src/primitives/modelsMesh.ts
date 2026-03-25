import * as THREE from 'three';
import GUI from 'lil-gui';
import { scene } from '../config/config';
import {AllModels,Vertex, Fragment, ColorHex, Toon, Shockwave, ShockToon} from './models';

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
    
  constructor(name: string, geometry: THREE.BufferGeometry | THREE.Group, shader: THREE.RawShaderMaterial, parameters: T) {
    this.parameters = parameters;
    this.name = name;
    
    // 1. Crear el material y la malla
    // Usamos MeshStandardMaterial para poder cambiar el color y que reaccione a luces
    this.shader = shader;

    if (geometry instanceof THREE.BufferGeometry) {
        this.mesh = new THREE.Mesh(geometry, this.shader);
    } else {
        this.mesh = geometry; // Si es un Group, lo usamos directamente
    }

    //this.shader.uniforms.modelMatrix.value = this.mesh.matrixWorld;
    // 2. Parámetros expuestos a la UI


    // 3. Crear su propia "Carpeta" en la interfaz
    this.fileGUI = gui.addFolder(this.name);
  }

  protected forEachMesh(callback: (mesh: THREE.Mesh) => void): void {
    this.mesh.traverse((child) => {
        // Type guard de Three.js para saber si es un Mesh
        if ((child as THREE.Mesh).isMesh) {
            callback(child as THREE.Mesh);
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

export class VertexModel extends ModelsMesh<Vertex> {
  constructor(name: string, geometry: THREE.BufferGeometry | THREE.Group, shader: THREE.RawShaderMaterial, params: Vertex) {
      super(name, geometry, shader, params);
      this.buildGUI();
      
      // Inicializar uniforms
      this.forEachMesh(mesh => {
          const material = mesh.material as THREE.RawShaderMaterial;
          material.uniforms.Smoothness = { value: params.Smoothness };
          material.uniforms.Hardness = { value: params.Hardness };
      });
  }
  
  protected buildGUI(): void {
    //color
    this.fileGUI.addColor(this.parameters, 'color').name("Color").onChange((nuevoHex: ColorHex) => {
      this.forEachMesh(mesh => {
        (mesh.material as THREE.RawShaderMaterial).uniforms.color.value.set(nuevoHex);
      });
    });
    
    this.fileGUI.add(this.parameters, 'scale', 0.1, 5.0).name('Escala Global').onChange((v: number) => {
      // scale.set(x, y, z) escala uniformemente en todos los ejes
      this.mesh.scale.set(v, v, v);
    });

    // Parámetros de deformación
    const deformFolder = this.fileGUI.addFolder('Deformación');
    deformFolder.add(this.parameters, 'Smoothness', -5.0, 5.0).name('Frecuencia').onChange((val: any) => {
      this.forEachMesh(mesh => {
        (mesh.material as THREE.RawShaderMaterial).uniforms.Smoothness.value = val;
      });
    });
    deformFolder.add(this.parameters, 'Hardness', -2.0, 2.0).name('Amplitud').onChange((val: any) => {
      this.forEachMesh(mesh => {
        (mesh.material as THREE.RawShaderMaterial).uniforms.Hardness.value = val;
      });
    });
    deformFolder.open();
  }
}

export class FragmentModel extends ModelsMesh<Fragment> {
  constructor(name: string, geometry: THREE.BufferGeometry | THREE.Group, shader: THREE.RawShaderMaterial, params: Fragment) {
    super(name, geometry, shader, params);
    
    this.buildGUI();

  }

  protected buildGUI(): void {
    // Aquí irá la lógica para cuando uses uniforms en el fragment shader

    this.fileGUI.addColor(this.parameters, 'meshColor').name("Color").onChange((nuevoHex: ColorHex) => {
      this.shader.uniforms.uObjectColor.value.set(nuevoHex);
    });

    this.fileGUI.add(this.parameters, 'scale', 0.1, 5.0).name('Escala Global').onChange((v: number) => {
      // scale.set(x, y, z) escala uniformemente en todos los ejes
      this.mesh.scale.set(v, v, v);
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
    console.log('Construyendo modelo tipo fragment');
  }
}

export class ToonModel extends ModelsMesh<Toon> {
  constructor(name: string, geometry: THREE.BufferGeometry | THREE.Group, shader: THREE.RawShaderMaterial, params: Toon) {
    super(name, geometry, shader, params);
    this.mesh.name = "toon"
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

    console.log('Construyendo modelo tipo toon');
  }
}
export class ShockwaveModel extends ModelsMesh<Shockwave> {
  constructor(name: string, geometry: THREE.BufferGeometry | THREE.Group, shader: THREE.RawShaderMaterial, params: Shockwave) {
    super(name, geometry, shader, params);
    this.mesh.name = "shockwave"
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

    console.log('Construyendo modelo tipo shockwave');
  }
}

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
}

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

  if (parametros.type === 'vertex') {
      model = new VertexModel(nombre, geometria, shader, parametros);
  } else if (parametros.type === 'fragment') {
      model = new FragmentModel(nombre, geometria, shader, parametros);
  } else if (parametros.type === 'toon') {
      model = new ToonModel(nombre, geometria, shader, parametros);
  } else if (parametros.type === 'shockwave') {
      model = new ShockwaveModel(nombre, geometria, shader, parametros); 
  } else if (parametros.type === 'shocktoon') {
      model = new ShockToonModel(nombre, geometria, shader, parametros);
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