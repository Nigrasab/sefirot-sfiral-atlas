import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function SfiralCurve({ s }: { s: number }) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const count = 200;

    for (let i = 0; i <= count; i++) {
      const t = -1 + (i / count) * 2;
      const mirror = t <= 0 ? 1 : -1;
      const radius = 2 - Math.abs(t) * 0.5;
      const theta = Math.abs(t) * Math.PI * 2.5;
      const z = t * 3;

      const x = radius * Math.sin(theta) * mirror;
      const y = radius * Math.cos(theta);

      pts.push(new THREE.Vector3(x, y, z));
    }

    return pts;
  }, []);

  return (
    <>
      <Line
        points={points}
        color="#7dd3fc"
        lineWidth={3}
        transparent
        opacity={0.7}
      />
    </>
  );
}

function MovingPoint({ s }: { s: number }) {
  const meshRef = useRef<any>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const mirror = s <= 0 ? 1 : -1;
      const radius = 2 - Math.abs(s) * 0.5;
      const theta = Math.abs(s) * Math.PI * 2.5;
      const z = s * 3;

      const x = radius * Math.sin(theta) * mirror;
      const y = radius * Math.cos(theta);

      meshRef.current.position.set(x, y, z);
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.1);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.15, 32, 32]} />
      <meshStandardMaterial
        color="#d4af37"
        emissive="#d4af37"
        emissiveIntensity={2}
      />
    </mesh>
  );
}

export default function SfiralCanvas3D({ s }: { s: number }) {
  return (
    <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1} />
      <SfiralCurve s={s} />
      <MovingPoint s={s} />
      <OrbitControls />
    </Canvas>
  );
}
