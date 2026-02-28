import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMousePosition } from '@/hooks/useMousePosition';

function ParticleField() {
  const meshRef = useRef<THREE.Points>(null);
  const mousePosition = useMousePosition();

  const particleCount = 800;

  const [positions, colors, sizes] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const color1 = new THREE.Color('#FF2E00');
    const color2 = new THREE.Color('#ffffff');
    const color3 = new THREE.Color('#333333');

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Spherical distribution
      const radius = Math.random() * 15 + 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Color mixing
      const colorChoice = Math.random();
      let color;
      if (colorChoice < 0.1) {
        color = color1;
      } else if (colorChoice < 0.3) {
        color = color2;
      } else {
        color = color3;
      }
      
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = Math.random() * 2 + 0.5;
    }

    return [positions, colors, sizes];
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    }),
    []
  );

  useFrame((state) => {
    if (meshRef.current) {
      uniforms.uTime.value = state.clock.elapsedTime;
      uniforms.uMouse.value.set(
        mousePosition.normalizedX * 0.5,
        mousePosition.normalizedY * 0.5
      );
      
      // Slow rotation
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
    }
  });

  const vertexShader = `
    uniform float uTime;
    uniform float uPixelRatio;
    uniform vec2 uMouse;
    
    attribute float size;
    attribute vec3 color;
    
    varying vec3 vColor;
    varying float vAlpha;
    
    void main() {
      vColor = color;
      
      vec3 pos = position;
      
      // Wave motion
      float wave = sin(pos.x * 0.5 + uTime * 0.5) * 0.3;
      float wave2 = cos(pos.y * 0.3 + uTime * 0.3) * 0.3;
      pos.z += wave + wave2;
      
      // Mouse interaction - subtle attraction
      vec3 mousePos = vec3(uMouse.x * 10.0, uMouse.y * 10.0, 0.0);
      float dist = distance(pos.xy, mousePos.xy);
      float attraction = smoothstep(5.0, 0.0, dist) * 0.5;
      pos.xy += normalize(mousePos.xy - pos.xy) * attraction;
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      
      gl_Position = projectionMatrix * mvPosition;
      gl_PointSize = size * uPixelRatio * (30.0 / -mvPosition.z);
      
      // Distance-based alpha
      vAlpha = smoothstep(20.0, 0.0, length(pos));
    }
  `;

  const fragmentShader = `
    varying vec3 vColor;
    varying float vAlpha;
    
    void main() {
      // Circular particle
      vec2 center = gl_PointCoord - 0.5;
      float dist = length(center);
      
      if (dist > 0.5) discard;
      
      // Soft edge
      float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;
      
      gl_FragColor = vec4(vColor, alpha * 0.8);
    }
  `;

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ConnectingLines() {
  const lineRef = useRef<THREE.LineSegments>(null);
  const particleCount = 50;

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * particleCount * 6);
    return pos;
  }, []);

  const particlePositions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < particleCount; i++) {
      pos.push({
        x: (Math.random() - 0.5) * 20,
        y: (Math.random() - 0.5) * 20,
        z: (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 0.02,
        vy: (Math.random() - 0.5) * 0.02,
        vz: (Math.random() - 0.5) * 0.01,
      });
    }
    return pos;
  }, []);

  useFrame(() => {
    if (!lineRef.current) return;

    const positionAttribute = lineRef.current.geometry.attributes.position;
    const array = positionAttribute.array as Float32Array;

    // Update particle positions
    particlePositions.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.z += p.vz;

      // Bounce off boundaries
      if (Math.abs(p.x) > 10) p.vx *= -1;
      if (Math.abs(p.y) > 10) p.vy *= -1;
      if (Math.abs(p.z) > 5) p.vz *= -1;
    });

    // Update line positions - connect nearby particles
    let lineIndex = 0;
    const maxDistance = 4;
    const maxConnections = 3;

    for (let i = 0; i < particleCount && lineIndex < array.length / 6; i++) {
      let connections = 0;
      for (let j = i + 1; j < particleCount && connections < maxConnections; j++) {
        const dx = particlePositions[i].x - particlePositions[j].x;
        const dy = particlePositions[i].y - particlePositions[j].y;
        const dz = particlePositions[i].z - particlePositions[j].z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < maxDistance) {
          const idx = lineIndex * 6;
          array[idx] = particlePositions[i].x;
          array[idx + 1] = particlePositions[i].y;
          array[idx + 2] = particlePositions[i].z;
          array[idx + 3] = particlePositions[j].x;
          array[idx + 4] = particlePositions[j].y;
          array[idx + 5] = particlePositions[j].z;
          lineIndex++;
          connections++;
        }
      }
    }

    // Clear remaining lines
    for (let i = lineIndex * 6; i < array.length; i++) {
      array[i] = 0;
    }

    positionAttribute.needsUpdate = true;
  });

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#FF2E00" transparent opacity={0.15} />
    </lineSegments>
  );
}

export function ParticleBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <ParticleField />
        <ConnectingLines />
      </Canvas>
    </div>
  );
}
