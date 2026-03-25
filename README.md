# Proyecto Shaders 01 CI5321

Este proyecto es una base para experimentar con shaders personalizados usando Three.js y TypeScript. Permite crear modelos 3D, aplicar diferentes tipos de shaders (vertex y fragment), y controlar parámetros visuales desde una interfaz gráfica.

## Funcionalidades principales

- **Renderizado 3D:** Utiliza Three.js para mostrar modelos en una escena.
- **Shaders personalizados:** Permite cargar y aplicar shaders GLSL (vertex y fragment) a los modelos.
- **Control de parámetros:** Los modelos tienen parámetros como color, escala y modo alambre, modificables desde una interfaz gráfica (lil-gui).
- **Gestión de modelos:** Puedes agregar, ocultar, mostrar y cambiar entre diferentes modelos en la escena.
- **Configuración modular:** El código está organizado en módulos para facilitar la extensión y el mantenimiento.

## Estructura del proyecto

```
├── index.html
├── package.json
├── README.md
├── public/
├── src/
│   ├── glsl.d.ts
│   ├── main.ts
│   ├── style.css
│   ├── config/
│   │   ├── animate.ts
│   │   ├── config.ts
│   │   ├── controls.ts
│   ├── primitives/
│   │   ├── models.ts
│   │   ├── modelsMesh.ts
│   │   ├── shaders/
│   │   │   ├── fragment.glsl
│   │   │   ├── vertex.glsl
```

## Instalación y ejecución

1. Instala las dependencias:
	```bash
	npm install
	```
2. Inicia el proyecto:
	```bash
	npm run dev
	```
	(Asegúrate de tener configurado Vite o el bundler correspondiente para importar archivos GLSL)

## Uso

Al iniciar el proyecto, se muestra una escena 3D. Puedes agregar modelos usando la función `addModel`, especificando el tipo de shader y los parámetros iniciales. Los controles de cada modelo aparecen en la interfaz gráfica, permitiendo modificar color, escala y modo alambre en tiempo real.

### Ejemplo para agregar un modelo:

```typescript
addModel('Triángulo', geometry, material, {
  type: 'vertex',
  color: '#ff0000',
  escala: 1,
  alambre: false,
});
```

## Personalización

- Puedes crear nuevos shaders en la carpeta `src/primitives/shaders/`.
- Modifica o extiende las interfaces de parámetros en `models.ts` para agregar nuevas propiedades.
- Añade nuevas funcionalidades en los módulos de configuración o controles.

## Requisitos

- Node.js
- npm
- Three.js
- lil-gui
- Vite (o bundler compatible)

## Créditos

Proyecto desarrollado para la materia CI5321. Basado en ejemplos de Three.js y adaptado para experimentación con shaders.

---
¡Explora, modifica y aprende sobre gráficos 3D y shaders!