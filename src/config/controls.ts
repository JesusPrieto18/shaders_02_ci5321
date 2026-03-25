import * as THREE from 'three';
import {changeModel} from '../primitives/modelsMesh';

export function controls() {
    window.addEventListener('keydown', (event) => {
        // 1. Extraemos solo el número del string de la tecla 
        // Ej: 'Numpad1' -> '1' | 'Digit3' -> '3' | 'KeyW' -> 'KeyW'
        const teclaLimpia = event.code.replace('Numpad', '').replace('Digit', '');
        
        // 2. Intentamos convertir ese string a un número matemático
        const numeroPresionado = parseInt(teclaLimpia);

        // 3. Validamos: ¿Es un número válido? ¿Está entre 1 y la cantidad total de modelos que tenemos?
        if (!isNaN(numeroPresionado) && numeroPresionado >= 0) {
            
            // Aquí ocurre la magia: Traducimos el número humano al índice de la máquina
           // const nuevoIndice = numeroPresionado - 1;
        
        // Si presionó una tecla válida y no es el modelo que ya estamos viendo
            changeModel(numeroPresionado);
        
        }
    });
}