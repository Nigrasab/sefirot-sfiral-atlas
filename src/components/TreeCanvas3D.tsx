import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Line } from '@react-three/drei';
import { sefirot } from '../data/sefirot';
import { treeEdges } from '../data/treeEdges';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function SefirahNode({ sefirah, selected, onClick }: { sefirah: any; selected: boolean; onClick: () => void }) {
  const meshRef = useRef<any>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      const scale = selected ? 1.3 : 1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={[sefirah.position.x, sefirah.position.y, 0]}>
      <Sphere ref={meshRef} args={[0.4, 32, 32]} onClick={onClick}>
        <meshStandardMaterial
          color={sefirah.color}
          emissive={sefirah.color}
          emissiveIntensity={selected ? 0.8 : 0.3}
          metalness={0.3}
          roughness={0.4}
        />
      </Sphere>
      <Text
        position={[0, -0.8, 0]}
        fontSize={0.3}
        color="#f5f1e8"
        anchorX="center"
        anchorY="middle"
      >
        {sefirah.name}
      </Text>
    </group>
  );
}

export default function TreeCanvas3D({ selected, onSelect }: { selected: number | null; onSelect: (id: number) => void }) {
  return (
    <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {treeEdges.map(([from, to], index) => {
        const a = sefirot.find((s) => s.id === from)!;
        const b = sefirot.find((s) => s.id === to)!;
        const active = selected !== null && (selected === from || selected === to);

        return (
          <Line
            key={index}
            points={[
              [a.position.x, a.position.y, 0],
              [b.position.x, b.position.y, 0]
            ]}
            color={active ? '#d4af37' : 'rgba(212,175,55,0.3)'}
            lineWidth={active ? 3 : 1}
          />
        );
      })}

      {sefirot.map((sefirah) => (
        <SefirahNode
          key={sefirah.id}
          sefirah={sefirah}
          selected={selected === sefirah.id}
          onClick={() => onSelect(sefirah.id)}
        />
      ))}

      <OrbitControls enableZoom enablePan enableRotate />
    </Canvas>
  );
}
