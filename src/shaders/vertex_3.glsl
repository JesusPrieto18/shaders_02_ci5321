// vertexShader
in vec3 position;
in vec3 normal;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform vec3 uViewPos; // RECIBIMOS LA CÁMARA VIVA

out vec3 vNormal;
out vec3 vFragPos; // Posición 3D del píxel para calcular distancias
out vec3 vViewDir;

void main() {
    // Calculamos la normal directamente desde el modelMatrix (a prueba de fallos)
    vNormal = normalize(mat3(modelMatrix) * normal);
    
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vFragPos = worldPosition.xyz;
    
    // MAGIA: Usamos la posición viva en lugar de la inversa de la matriz congelada
    vViewDir = normalize(uViewPos - vec3(worldPosition));
    
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}