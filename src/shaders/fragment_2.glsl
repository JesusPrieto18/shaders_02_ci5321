precision highp float;

uniform vec3 uLightPos;
uniform vec3 uViewPos;   // Posición de la cámara
uniform vec3 uLightColor;
uniform vec3 uObjectColor; // El color base del material
uniform vec3 uSpecularColor; // NUEVO: El color específico del brillo
uniform float uShininess;  // Qué tan pulido es el objeto (ej. 32.0)

in vec3 vNormal;
in vec3 vFragPos;

out vec4 fragColor;

//in vec3 vColor;

//out vec4 fragColor; // Necesario porque en RawShader no existe gl_FragColor automático en GLSL3

void main() {
    // 0. Preparativos: Asegurarnos de que todos los vectores tengan longitud exacta de 1.0
    vec3 N = normalize(vNormal);
    
    if (!gl_FrontFacing) {
        N = N * -1.0;
    }
    
    // El vector de luz es: (Posición Luz - Posición Píxel)
    vec3 L = normalize(uLightPos - vFragPos);
    // El vector de vista es: (Posición Cámara - Posición Píxel)
    vec3 V = normalize(uViewPos - vFragPos);
    
    // 1. LUZ AMBIENTE (Luz indirecta constante)
    float ambientStrength = 0.1; // 10% de luz siempre
    vec3 ambient = ambientStrength * uLightColor;

    // 2. LUZ DIFUSA (Ley de Lambert)
    // Producto punto entre Normal y Vector de Luz (max evita valores negativos)
    float diff = max(dot(N, L), 0.0);
    vec3 diffuse = diff * uLightColor;

    // 3. LUZ ESPECULAR (Blinn-Phong)
    // Calculamos el vector intermedio H (sumar y normalizar)
    vec3 H = normalize(L + V);
    // Calculamos el alineamiento de H con la Normal, y lo elevamos a la potencia Shininess
    float spec = pow(max(dot(N, H), 0.0), uShininess);
    vec3 specular = spec * uSpecularColor; // La luz especular toma el color del objeto

    // RESULTADO FINAL: Sumamos las 3 luces y multiplicamos por el color del objeto
    vec3 finalLight = (ambient + diffuse + specular);
    vec3 result = finalLight * uObjectColor;

    fragColor = vec4(result, 1.0);
}

