// #version 300 es
precision highp float;

in vec3 position;
in vec3 normal;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform float uFrequency; // Controla la distancia entre las crestas de la onda
uniform float uVelocity;   // Controla la velocidad de expansión de la onda
uniform float uAmplitude;  // Controla la altura máxima de la onda
// ¡EL NUEVO INGREDIENTE! El reloj que controlará la expansión
uniform float uTime; 
uniform vec3 uViewPos; // RECIBIMOS LA CÁMARA VIVA

out vec3 vNormal;
out vec3 vFragPos;
out vec3 vViewDir;

void main() {
    // 1. Calculamos la distancia de este vértice respecto al centro (0,0) en el plano XZ (piso)
    // position.xz extrae solo los ejes horizontales.
    float dist = length(position.xz);

    // 2. CREAMOS LA ONDA (La magia)
    // Multiplicar 'dist' hace que los anillos sean más delgados o gruesos.
    // Multiplicar 'uTime' controla la velocidad a la que se expanden.

    float wave = sin((dist * uFrequency) - (uTime * uVelocity));

    // 3. ATENUACIÓN (Opcional pero recomendado)
    // Hacemos que la onda pierda fuerza a medida que se aleja del centro, como en la vida real.
    float amplitud = uAmplitude / (dist + 1.0); 
    
    // 4. APLICAMOS EL MOVIMIENTO
    // Copiamos la posición original y le sumamos la onda a la altura (eje Y)
    vec3 newPosition = position;
    newPosition.y += wave * amplitud;

    // Pasamos las variables al Fragment Shader (por si quieres usar tu Toon Shading aquí también)
    vNormal = normalize(mat3(modelMatrix) * normal);
    //vFragPos = (modelMatrix * vec4(newPosition, 1.0)).xyz;
    
    vec4 worldPosition = (modelMatrix * vec4(newPosition, 1.0));
    vFragPos = worldPosition.xyz;
    
    // MAGIA: Usamos la posición viva en lugar de la inversa de la matriz congelada
    vViewDir = normalize(uViewPos - vec3(worldPosition));

    // Calculamos la posición final en pantalla usando nuestra NUEVA posición
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(newPosition, 1.0);
}