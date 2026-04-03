precision highp float;

in vec3 position;
in vec3 aRandomness;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform float uTime;
uniform float uSize;
uniform float uExplosionForce;
uniform float uOscillationSpeed;
uniform float uGravity;

out float vLife;

void main() {
    // 1. EL PULSO "LÁTIGO" (Muy sensible a la velocidad)
    // A mayor velocidad, el pulso es más corto y violento (exponente 6.0)
    float wave = abs(sin(uTime * uOscillationSpeed));
    float pulse = pow(wave, 6.0); 

    // 2. EXPANSIÓN GEOMÉTRICA
    // Multiplicamos la posición por la fuerza. Si fuerza es 10, el objeto es 11 veces más grande.
    vec3 animatedPosition = position * (1.0 + (uExplosionForce * pulse));

    // 3. GRAVEDAD DE APLASTAMIENTO (Muy sensible a uGravity)
    // La gravedad aquí hace dos cosas:
    // A) Tira hacia abajo (Y negativo)
    animatedPosition.y -= uGravity * pulse * 2.0; 
    
    // B) APLASTA el objeto: Si hay mucha gravedad, el objeto se expande hacia los lados 
    // pero se achata en el eje Y (como una tortita).
    animatedPosition.y *= (1.0 - (uGravity * 0.1 * pulse));
    animatedPosition.xz *= (1.0 + (uGravity * 0.05 * pulse));

    // 4. ESTIRAMIENTO POR VELOCIDAD (Stretch)
    // Si la velocidad es alta, estiramos las partículas en su dirección de movimiento
    // para que parezca que van "muy rápido".
    animatedPosition += normalize(position) * (uOscillationSpeed * pulse * 0.2);

    // 5. CAOS VIOLENTO
    // El desorden ahora es errático, no suave.
    animatedPosition += aRandomness * pulse * uExplosionForce * 0.5;

    vLife = pulse;

    vec4 worldPosition = modelMatrix * vec4(animatedPosition, 1.0);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;

    // 6. TAMAÑO DE IMPACTO
    // Puntos gigantes cuando explotan, puntos diminutos cuando regresan.
    float sizeFactor = uSize * (1.0 + pulse * uExplosionForce);
    gl_PointSize = sizeFactor * 30.0 / gl_Position.w;
}