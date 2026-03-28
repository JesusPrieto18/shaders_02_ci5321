precision highp float;

in vec3 position; // x = Radio, y = Altura, z = Ángulo

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform float uTime;
uniform float uSize;
uniform float uSpeed;
uniform float uUpSpeed;
uniform float uMaxHeight;

out float vLife; // Se lo pasamos al fragment para difuminar las partículas

void main() {
    float radius = position.x;
    float height = position.y;
    float angle = position.z;

    // --- FÍSICA DEL TORNADO ---
    
    // 1. Ascenso infinito: Hacemos que la altura suba con el tiempo.
    // mod(x, y) reinicia la partícula al suelo cuando alcanza 'uMaxHeight'
    float currentHeight = mod(height + (uTime * uUpSpeed), uMaxHeight);

    // 2. Rotación dinámica: Sumamos tiempo al ángulo.
    // Dividir entre el radio hace que el centro gire más rápido (física de vórtices real)
    float currentAngle = angle + (uTime * uSpeed) / (radius + 0.5);

    // 3. El Embudo: Multiplicamos el radio por la altura actual.
    // Entre más alta esté la partícula, más ancho es el círculo que describe.
    float funnelRadius = radius * (1.0 + currentHeight * 0.3);

    // --- CONVERSIÓN DE POLAR A CARTESIANA (X, Y, Z reales) ---
    vec3 realPosition;
    realPosition.x = funnelRadius * cos(currentAngle);
    realPosition.y = currentHeight;
    realPosition.z = funnelRadius * sin(currentAngle);

    // --- ESTILIZACIÓN ---
    // Calculamos una "vida" basada en una onda de seno (0 en el suelo, 1 en el medio, 0 en la cima)
    // Esto hace que las partículas no aparezcan o desaparezcan de golpe.
    vLife = sin((currentHeight / uMaxHeight) * 3.14159);

    vec4 worldPosition = modelMatrix * vec4(realPosition, 1.0);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;

    // gl_PointSize es una variable nativa de GLSL. 
    // Lo escalamos por 'gl_Position.w' para que las partículas se vean más pequeñas de lejos.
    gl_PointSize = uSize * (15.0 / gl_Position.w) * vLife; 
}