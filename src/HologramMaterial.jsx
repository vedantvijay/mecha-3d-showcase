import * as THREE from 'three';

/**
 * Custom hologram shader material — Iron Man / sci-fi style.
 */
export function createHologramMaterial(color = '#00e5ff') {
  return new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uAlpha: { value: 0.7 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      varying float vWorldY;

      void main() {
        vUv = uv;
        vPosition = position;
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldY = worldPos.y;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewDir = normalize(-mvPosition.xyz);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform vec3 uColor;
      uniform float uAlpha;

      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      varying float vWorldY;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      void main() {
        float fresnel = pow(1.0 - abs(dot(vNormal, vViewDir)), 3.0);
        float scanLine = sin(vWorldY * 120.0 + uTime * 4.0) * 0.5 + 0.5;
        scanLine = smoothstep(0.3, 0.7, scanLine);
        float scanIntensity = mix(0.4, 1.0, scanLine);
        float barPos = mod(uTime * 0.6, 4.0) - 2.0;
        float scanBar = 1.0 - smoothstep(0.0, 0.15, abs(vWorldY - barPos));
        scanBar *= 0.6;
        float glitchBlock = step(0.97, random(vec2(floor(uTime * 15.0), 0.0)));
        float flicker = 1.0 - glitchBlock * 0.4;
        float edge = fresnel * 1.8;
        float alpha = (0.12 + edge * 0.7 + scanBar) * scanIntensity * flicker;
        alpha = clamp(alpha, 0.0, 1.0) * uAlpha;
        vec3 color = uColor * (0.6 + fresnel * 1.5 + scanBar * 2.0);
        vec3 fringe = vec3(fresnel * 0.3, fresnel * 0.1, 0.0);
        color += fringe;
        gl_FragColor = vec4(color, alpha);
      }
    `,
  });
}

/**
 * Energy Shield — force field wrapping the model.
 */
export function createShieldMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#00e5ff') },
      uHitPoint: { value: new THREE.Vector3(0, 0, 0) },
      uHitTime: { value: -10 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      varying vec3 vWorldPos;

      void main() {
        vPosition = position;
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPos = worldPos.xyz;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewDir = normalize(-mvPosition.xyz);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform vec3 uColor;
      uniform vec3 uHitPoint;
      uniform float uHitTime;

      varying vec3 vPosition;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      varying vec3 vWorldPos;

      void main() {
        // Fresnel edge
        float fresnel = pow(1.0 - abs(dot(vNormal, vViewDir)), 4.0);

        // Hex grid pattern
        float scale = 18.0;
        vec2 hex = vPosition.xy * scale;
        hex.x *= 1.1547; // 2/sqrt(3)
        float offset = step(1.0, mod(hex.y, 2.0)) * 0.5;
        hex.x += offset;
        hex = fract(hex) - 0.5;
        float hexDist = max(abs(hex.x), abs(hex.y * 0.866 + hex.x * 0.5));
        float hexLine = smoothstep(0.45, 0.5, hexDist);

        // Travelling wave
        float wave = sin(vPosition.y * 8.0 - uTime * 2.0) * 0.5 + 0.5;

        // Hit ripple
        float timeSinceHit = uTime - uHitTime;
        float hitDist = distance(vWorldPos, uHitPoint);
        float ripple = sin(hitDist * 30.0 - timeSinceHit * 15.0) * 0.5 + 0.5;
        ripple *= exp(-timeSinceHit * 2.0) * exp(-hitDist * 3.0);
        ripple = max(ripple, 0.0);

        // Combine
        float alpha = fresnel * 0.4 + hexLine * 0.06 * wave + ripple * 0.8;
        alpha = clamp(alpha, 0.0, 0.6);

        vec3 color = uColor * (1.0 + ripple * 3.0);

        gl_FragColor = vec4(color, alpha);
      }
    `,
  });
}
