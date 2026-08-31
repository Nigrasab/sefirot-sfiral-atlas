import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line, Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { sefirot } from '../data/sefirot';
import { treeEdges } from '../data/treeEdges';

interface Props {
  selected: number | null;
  onSelect: (id: number) => void;
  sfiralS: number;
}

function SefiraSphere({
  sefirah,
  isSelected,
  onClick
}: {
  sefirah: (typeof sefirot)[number];
  isSelected: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const x = sefirah.position.x * 1.6;
  const y = sefirah.position.y * 1.6;
  const z = 0;

  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.8;
    }
  });

  return (
    <group position={[x, y, z]}>
      {/* Внешнее свечение */}
      <mesh>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshBasicMaterial
          color={sefirah.color}
          transparent
          opacity={isSelected ? 0.35 : 0.18}
        />
      </mesh>

      {/* Основная сфера */}
      <mesh ref={meshRef} onClick={onClick}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color={sefirah.color}
          emissive={sefirah.color}
          emissiveIntensity={isSelected ? 1.2 : 0.4}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Номер */}
      <Text
        position={[0, 0, 0.45]}
        fontSize={0.28}
        color="#05070f"
        anchorX="center"
        anchorY="middle"
        fontWeight={700}
      >
        {sefirah.id}
      </Text>

      {/* Название */}
      <Text
        position={[0, -0.75, 0]}
        fontSize={0.22}
        color="#f5f1e8"
        anchorX="center"
        anchorY="middle"
      >
        {sefirah.name}
      </Text>

      {/* Иврит */}
      <Text
        position={[0, -1.0, 0]}
        fontSize={0.2}
        color="#b8b2a7"
        anchorX="center"
        anchorY="middle"
      >
        {sefirah.hebrew}
      </Text>
    </group>
  );
}

function SfiralCurve({
  side,
  color
}: {
  side: 'left' | 'right';
  color: string;
}) {
  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    const steps = 240;
    const sign = side === 'left' ? -1 : 1;

    for (let i = 0; i <= steps; i++) {
      const t = -1 + (i / steps) * 2;
      const y = (t * 8);
      const radius = 3.5 * (1 - Math.abs(t) * 0.35);
      const theta = Math.abs(t) * Math.PI * 3;

      const x = radius * Math.sin(theta) * sign;
      const z = radius * Math.cos(theta) * sign * 0.6;

      pts.push([x, y, z]);
    }
    return pts;
  }, [side]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={2.5}
      transparent
      opacity={0.8}
    />
  );
}

function SfiralPoint({ s }: { s: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      const y = s * 8;
      const radius = 3.5 * (1 - Math.abs(s) * 0.35);
      const theta = Math.abs(s) * Math.PI * 3;
      const sign = s <= 0 ? -1 : 1;

      const x = radius * Math.sin(theta) * sign;
      const z = radius * Math.cos(theta) * sign * 0.6;

      meshRef.current.position.set(x, y, z);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.18, 32, 32]} />
      <meshStandardMaterial
        color="#d4af37"
        emissive="#d4af37"
        emissiveIntensity={3}
      />
    </mesh>
  );
}

function CentralAxis() {
  return (
    <Line
      points={[
        [0, -10, 0],
        [0, 10, 0]
      ]}
      color="#d4af37"
      lineWidth={1}
      transparent
      opacity={0.25}
      dashed
      dashSize={0.2}
      gapSize={0.15}
    />
  );
}

export default function UnifiedTreeSfiral3D({
  selected,
  onSelect,
  sfiralS
}: Props) {
  return (
    <div style={{ height: 700, borderRadius: 20, overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 0, 14], fov: 50 }}>
        <color attach="background" args={['#05070f']} />
        <Stars
          radius={50}
          depth={50}
          count={3000}
          factor={4}
          saturation={0}
          fade
          speed={0.5}
        />

        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.6} color="#7dd3fc" />
        <pointLight position={[0, 10, 5]} intensity={0.8} color="#d4af37" />

        <CentralAxis />

        {/* Левый виток V- */}
        <SfiralCurve side="left" color="#ef4444" />

        {/* Правый виток V+ */}
        <SfiralCurve side="right" color="#3b82f6" />

        {/* Пути Древа */}
        {treeEdges.map(([from, to], index) => {
          const a = sefirot.find((s) => s.id === from);
          const b = sefirot.find((s) => s.id === to);
          if (!a || !b) return null;

          const active = selected !== null && (selected === from || selected === to);

          return (
            <Line
              key={index}
              points={[
                [a.position.x * 1.6, a.position.y * 1.6, 0],
                [b.position.x * 1.6, b.position.y * 1.6, 0]
              ]}
              color={active ? '#ffffff' : '#d4af37'}
              lineWidth={active ? 3 : 1.5}
              transparent
              opacity={active ? 1 : 0.5}
            />
          );
        })}

        {/* Сфирот */}
        {sefirot.map((sefirah) => (
          <SefiraSphere
            key={sefirah.id}
            sefirah={sefirah}
            isSelected={selected === sefirah.id}
            onClick={() => onSelect(sefirah.id)}
          />
        ))}

        {/* Движущаяся точка по Сфирали */}
        <SfiralPoint s={sfiralS} />

        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          autoRotate
          autoRotateSpeed={0.4}
          minDistance={5}
          maxDistance={30}
        />
      </Canvas>
    </div>
  );
}
