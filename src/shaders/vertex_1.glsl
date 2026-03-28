precision highp float;

in vec3 position; 
in vec3 aRandomness; // Recibimos el vector de caos único de esta partícula

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform float uTime;
uniform float uSize;
uniform float uSpeed;
uniform float uUpSpeed;
uniform float uMaxHeight;

// Los nuevos Uniforms
uniform float uRadiusBottom;
uniform float uRadiusTop;
uniform float uTurbulence;

out float vLife; 

void main() {
    float normRadius = position.x; // Viene como un porcentaje de 0.0 a 1.0
    float height = position.y;
    float angle = position.z;

    // Altura actual cíclica
    float currentHeight = mod(height + (uTime * uUpSpeed), uMaxHeight);
    
    // Porcentaje de altura (0.0 en el piso, 1.0 en la cima)
    float heightPercent = currentHeight / uMaxHeight;

    // --- 1. EL RADIO DINÁMICO ---
    // mix(A, B, porcentaje) mezcla linealmente entre el radio inferior y superior
    float currentMaxRadius = mix(uRadiusBottom, uRadiusTop, heightPercent);
    
    // El radio final es el porcentaje aleatorio de la partícula por el radio de esa altura
    float finalRadius = normRadius * currentMaxRadius;

    // --- 2. ROTACIÓN DENTRO DEL EMBUDO ---
    float currentAngle = angle + (uTime * uSpeed) / (finalRadius + 0.1); 

    vec3 realPosition;
    realPosition.x = finalRadius * cos(currentAngle);
    realPosition.y = currentHeight;
    realPosition.z = finalRadius * sin(currentAngle);

    // --- 3. APLICAR TURBULENCIA (El Caos) ---
    // Multiplicamos por 'heightPercent' para que la base del tornado sea apretada y estable,
    // pero se vuelva caótica y desordenada a medida que sube.
    realPosition += aRandomness * uTurbulence * heightPercent;

    vLife = sin(heightPercent * 3.14159);

    vec4 worldPosition = modelMatrix * vec4(realPosition, 1.0);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;

    gl_PointSize = uSize * (15.0 / gl_Position.w) * vLife; 
}