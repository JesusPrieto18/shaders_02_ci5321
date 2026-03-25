precision mediump float;

in vec3 vColor;

out vec4 fragColor; // Necesario porque en RawShader no existe gl_FragColor automático en GLSL3

void main() {
    fragColor = vec4(vColor, 1.0);
}

