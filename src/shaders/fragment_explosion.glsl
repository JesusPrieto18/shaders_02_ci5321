precision highp float;

uniform vec3 uColor;
in float vLife; // Recibimos la vida desde el Vertex

out vec4 FragColor;

void main() {
    // gl_PointCoord es una variable nativa mágica de los sistemas de partículas.
    // Nos da las coordenadas 2D (0 a 1) DENTRO del cuadrito de la partícula actual.
    vec2 uv = gl_PointCoord - vec2(0.5); // Centramos las coordenadas en (0,0)
    
    // Calculamos la distancia desde el centro del cuadrito
    float dist = length(uv);

    // Si la distancia es mayor a 0.5 (es decir, las esquinas del cuadrado), no dibujamos nada.
    if(dist > 0.5) {
        discard;
    }

    // Creamos un borde suave y difuminado (glow) en lugar de un círculo sólido duro
    float alpha = smoothstep(0.5, 0.1, dist) * vLife;

    FragColor = vec4(uColor, alpha);
}