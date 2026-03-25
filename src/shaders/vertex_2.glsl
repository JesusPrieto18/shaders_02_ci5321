precision highp float;

// Atributos definidos en la geometría
in vec3 position;
//in vec3 color;
in vec3 normal;

//out vec3 vColor;
out vec3 vNormal;
out vec3 vFragPos;

uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;

void main() {
  //vColor = color;
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);

  vFragPos = vec3(worldPosition);
  vNormal = mat3(modelMatrix) * normal;

  gl_Position = projectionMatrix * viewMatrix * worldPosition;

  //gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}