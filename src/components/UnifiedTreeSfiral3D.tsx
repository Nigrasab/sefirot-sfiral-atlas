import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { sefirot } from '../data/sefirot';
import { treeEdges } from '../data/treeEdges';

/* ============================================================
   ФОРМУЛА СФИРАЛИ (основная):
   R(s) = α(s)·r⁻(s) + β(s)·r⁺(s),  α²+β²=1
   r⁺(s) = M·r⁻(−s) + c  (зеркальная антисимметрия)
   ============================================================ */

interface SfiralParams {
  height: number;
  radius: number;
  turns: number;
  phase: number;
  segments: number;
}

// Генерация точек одной вертикальной Сфирали (два зеркальных витка + S-переход)
function generateSfiralPoints(opts: SfiralParams): THREE.Vector3[] {
  const { height, radius, turns, phase, segments } = opts;
  const points: THREE.Vector3[] = [];

  for (let i = 0; i <= segments; i++) {
    const s = -1 + (2 * i) / segments; // −1 … +1
    const y = (height / 2) * s;

    // Зеркальная антисимметрия: левый виток (s<0) ↔ правый виток (s>0)
    const mirror = s <= 0 ? 1 : -1;

    // Радиус сужается к центру — область S-петли
    const r = radius * (0.25 + 0.75 * Math.abs(s));

    const theta = turns * Math.PI * s + phase;

    const x = mirror * r * Math.cos(theta);
    const z = r * Math.sin(theta);

    points.push(new THREE.Vector3(x, y, z));
  }

  return points;
}

interface UniverseLevelConfig {
  numGroups: number;
  circulationRadius: number;
  sfiralHeight: number;
  sfiralRadius: number;
  turns: number;
  segments: number;
}

// Один фрактальный уровень модели Вселенной (круговорот Сфиралей)
function buildLevelGeometry(cfg: UniverseLevelConfig): number[] {
  const positions: number[] = [];

  for (let g = 0; g < cfg.numGroups; g++) {
    const groupAngle = (g / cfg.numGroups) * Math.PI * 2;

    const cx = cfg.circulationRadius * Math.cos(groupAngle);
    const cz = cfg.circulationRadius * Math.sin(groupAngle);

    const localPoints = generateSfiralPoints({
      height: cfg.sfiralHeight,
      radius: cfg.sfiralRadius,
      turns: cfg.turns,
      phase: groupAngle,
      segments: cfg.segments
    });

    const cos = Math.cos(groupAngle);
    const sin = Math.sin(groupAngle);

    const transformed = localPoints.map((p) => {
      const rx = p.x * cos + p.z * sin;
      const rz = -p.x * sin + p.z * cos;
      return new THREE.Vector3(rx + cx, p.y, rz + cz);
    });

    for (let i = 0; i < transformed.length - 1; i++) {
      positions.push(
        transformed[i].x, transformed[i].y, transformed[i].z,
        transformed[i + 1].x, transformed[i + 1].y, transformed[i + 1].z
      );
    }
  }

  return positions;
}

// Полная модель Вселенной: три фрактальных уровня (1 → 0.5 → 0.25)
function buildUniverseGeometry(levels: boolean[]): THREE.BufferGeometry {
  const positions: number[] = [];

  const base: UniverseLevelConfig = {
    numGroups: 72,
    circulationRadius: 5.5,
    sfiralHeight: 11,
    sfiralRadius: 0.9,
    turns: 2.2,
    segments: 36
  };

  // Уровень 0 — масштаб 1
  if (levels[0]) positions.push(...buildLevelGeometry(base));

  // Уровень 1 — масштаб 0.5 (расширяющийся слой наружу)
  if (levels[1]) {
    positions.push(
      ...buildLevelGeometry({
        numGroups: 72,
        circulationRadius: 8.5,
        sfiralHeight: 5.5,
        sfiralRadius: 0.45,
        turns: 2.2,
        segments: 20
      })
    );
  }

  // Уровень 2 — масштаб 0.25 (самый внешний слой)
  if (levels[2]) {
    positions.push(
      ...buildLevelGeometry({
        numGroups: 72,
        circulationRadius: 11.5,
        sfiralHeight: 2.75,
        sfiralRadius: 0.22,
        turns: 2.2,
        segments: 12
      })
    );
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
  return geo;
}

// Полупрозрачная модель Вселенной (медленно вращающийся круговорот)
function UniverseModel({ levels, opacity }: { levels: boolean[]; opacity: number }) {
  const ref = useRef<THREE.Group>(null);

  const geometry = useMemo(() => buildUniverseGeometry(levels), [levels]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.06;
    }
  });

  return (
    <group ref={ref}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial color="#7dd3fc" transparent opacity={opacity} />
      </lineSegments>
    </group>
  );
}

// Активная Сфираль (подсвеченная) + движущаяся точка фазы
function ActiveSfiral({ index, phase, numGroups }: { index: number; phase: number; numGroups: number }) {
  const groupAngle = (index / numGroups) * Math.PI * 2;

  const curve = useMemo(() => {
    const cx = 5.5 * Math.cos(groupAngle);
    const cz = 5.5 * Math.sin(groupAngle);

    const localPoints = generateSfiralPoints({
      height: 11,
      radius: 0.9,
      turns: 2.2,
      phase: groupAngle,
      segments: 80
    });

    const cos = Math.cos(groupAngle);
    const sin = Math.sin(groupAngle);

    const transformed = localPoints.map((p) => {
      const rx = p.x * cos + p.z * sin;
      const rz = -p.x * sin + p.z * cos;
      return new THREE.Vector3(rx + cx, p.y, rz + cz);
    });

    return new THREE.CatmullRomCurve3(transformed);
  }, [groupAngle]);

  const pointRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (pointRef.current) {
      const t = Math.max(0, Math.min(1, phase));
      const pos = curve.getPointAt(t);
      pointRef.current.position.copy(pos);
    }
  });

  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 120, 0.05, 10, false]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#b45309"
          emissiveIntensity={1.1}
          transparent
          opacity={0.95}
        />
      </mesh>

      <mesh ref={pointRef}>
        <sphereGeometry args={[0.14, 20, 20]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2.5} />
      </mesh>
    </group>
  );
}

/* ============================================================
   ДРЕВО СФИРОТ — центральная колонна совпадает с осью Сфирали
   ============================================================ */

const sefirotPositions: Record<number, [number, number, number]> = {
  1: [0, 5, 0],        // Кетер
  2: [1.5, 3.5, 0],    // Хохма
  3: [-1.5, 3.5, 0],   // Бина
  4: [1.5, 1.5, 0],    // Хесед
  5: [-1.5, 1.5, 0],   // Гвура
  6: [0, 0, 0],        // Тиферет — центр, узел инверсии
  7: [1.5, -1.5, 0],   // Нецах
  8: [-1.5, -1.5, 0],  // Ход
  9: [0, -3, 0],       // Йесод
  10: [0, -4.5, 0]     // Малхут
};

function SefiraNode({
  id,
  isSelected,
  onClick
}: {
  id: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  const sefirah = sefirot.find((s) => s.id === id);
  const meshRef = useRef<THREE.Mesh>(null);
  const position = sefirotPositions[id];

  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.9;
    }
  });

  if (!sefirah || !position) return null;

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshBasicMaterial
          color={sefirah.color}
          transparent
          opacity={isSelected ? 0.35 : 0.14}
        />
      </mesh>

      <mesh ref={meshRef} onClick={onClick}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial
          color={sefirah.color}
          emissive={sefirah.color}
          emissiveIntensity={isSelected ? 1.6 : 0.55}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>

      <Text position={[0, 0, 0.34]} fontSize={0.2} color="#05070f" anchorX="center" anchorY="middle" fontWeight={700}>
        {sefirah.id}
      </Text>

      <Text position={[0, -0.55, 0]} fontSize={0.16} color="#f5f1e8" anchorX="center" anchorY="middle">
        {sefirah.name}
      </Text>

      <Text position={[0, -0.76, 0]} fontSize={0.13} color="#b8b2a7" anchorX="center" anchorY="middle">
        {sefirah.hebrew}
      </Text>
    </group>
  );
}

function TreePaths({ selected }: { selected: number | null }) {
  return (
    <>
      {treeEdges.map(([from, to], i) => {
        const p1 = sefirotPositions[from];
        const p2 = sefirotPositions[to];
        if (!p1 || !p2) return null;

        const active = selected !== null && (selected === from || selected === to);

        return (
          <Line
            key={i}
            points={[p1, p2]}
            color={active ? '#ffffff' : '#d4af37'}
            lineWidth={active ? 3 : 1.4}
            transparent
            opacity={active ? 1 : 0.5}
          />
        );
      })}
    </>
  );
}

/* ============================================================
   ГЛАВНАЯ СЦЕНА
   ============================================================ */

interface Props {
  selectedSefira: number | null;
  onSelectSefira: (id: number) => void;
  activeSfiralIndex: number;
  sfiralPhase: number;
  fractalLevels: boolean[];
  universeOpacity: number;
}

export default function UnifiedTreeSfiral3D({
  selectedSefira,
  onSelectSefira,
  activeSfiralIndex,
  sfiralPhase,
  fractalLevels,
  universeOpacity
}: Props) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [9, 3, 13], fov: 45 }}>
        <color attach="background" args={['#0f172a']} />
        <Stars radius={90} depth={50} count={3500} factor={4} saturation={0} fade speed={0.5} />

        <ambientLight intensity={0.6} />
        <pointLight position={[-10, 10, 10]} intensity={1.4} color="#38bdf8" />
        <pointLight position={[10, -10, 10]} intensity={1.4} color="#a78bfa" />
        <pointLight position={[0, 0, 8]} intensity={1} color="#fbbf24" />

        {/* Полупрозрачная модель Вселенной: круговорот Сфиралей вокруг Древа */}
        <UniverseModel levels={fractalLevels} opacity={universeOpacity} />

        {/* Активная (подсвеченная) Сфираль */}
        <ActiveSfiral index={activeSfiralIndex} phase={sfiralPhase} numGroups={72} />

        {/* Древо Сфирот внутри, на центральной оси */}
        <TreePaths selected={selectedSefira} />
        {sefirot.map((s) => (
          <SefiraNode
            key={s.id}
            id={s.id}
            isSelected={selectedSefira === s.id}
            onClick={() => onSelectSefira(s.id)}
          />
        ))}

        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          autoRotate
          autoRotateSpeed={0.4}
          minDistance={4}
          maxDistance={40}
        />
      </Canvas>
    </div>
  );
}
