uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform vec3 color;

uniform float Smoothness;  // Longitud
uniform float Hardness;    // Curvatura

in vec3 position;
in vec3 normal;


out vec3 vColor;
out vec3 vNormal;
out float vIntensity;

void main() {
    // ===== EFECTO LÁTIGO =====
    // Hacer que el cono se curve como un látigo
    
    // Normalizar altura
    float t = (position.y + 1.0) * 0.5;
    
    // Curvatura parabólica
    float curveX = t * t * Smoothness;
    float curveZ = t * Hardness;
    
    vIntensity = t;
    
    // Aplicar curvatura
    vec3 newPosition = position;
    newPosition.x += curveX;
    newPosition.z += curveZ;
    newPosition.y *= 1.0 + t * 0.5; // Estirar un poco
    
    vColor = color;
    vNormal = normalize(mat3(modelMatrix) * normal);
    
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(newPosition, 1.0);
}