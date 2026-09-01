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

   КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ:
   Продольная ось Сфиралей модели Вселенной совпадает
   с центральной колонной Древа Сфирот (вертикаль).
   Модель НЕ раскладывается по окружности вокруг Древа,
   а пространственно совмещена с ним.
   ============================================================ */

// Позиции сфирот Древа (вертикальная ориентация, центральная колонна по оси Y)
const sefirotPositions: Record<number, [number, number, number]> = {
  1: [0, 5.5, 0],       // Кетер — верх центральной колонны
  2: [1.8, 4, 0],       // Хохма — правая колонна
  3: [-1.8, 4, 0],      // Бина — левая колонна
  4: [1.8, 1.8, 0],     // Хесед — правая колонна
  5: [-1.8, 1.8, 0],    // Гвура — левая колонна
  6: [0, 0, 0],         // Тиферет — центр, узел инверсии
  7: [1.8, -2, 0],      // Нецах — правая колонна
  8: [-1.8, -2, 0],     // Ход — левая колонна
  9: [0, -3.8, 0],      // Йесод — центральная колонна
  10: [0, -5.5, 0]      // Малхут — низ центральной колонны
};

/* ============================================================
   ГЕНЕРАЦИЯ МОДЕЛИ ВСЕЛЕННОЙ (совмещена с Древом)

   Модель: две зеркально-антисимметричные цепочки Сфиралей,
   соединённые по продольной оси. Продольная ось = центральная
   колонна Древа (ось Y). Витки образуют окружности вокруг
   этой оси на разных высотах (уровнях Древа).

   Три фрактальных масштаба: 1 → 0.5 → 0.25
   Растяжение: ×5
   ============================================================ */

interface SfiralChainParams {
  scale: number;        // фрактальный масштаб (1, 0.5, 0.25)
  side: 1 | -1;         // 1 = правая цепочка, -1 = левая цепочка
  turns: number;        // число витков
  segments: number;     // детализация
}

// Генерация одной Сфиральной цепочки, вытянутой вдоль центральной оси (Y)
function generateChainPoints(params: SfiralChainParams): THREE.Vector3[] {
  const { scale, side, turns, segments } = params;
  const points: THREE.Vector3[] = [];

  // Высота цепочки соответствует вертикальному размаху Древа,
  // умноженному на растяжение ×5 и масштаб
  const totalHeight = 11 * 5 * scale;
  const halfHeight = totalHeight / 2;

  // Радиус витков: зеркальные цепочки смещены в стороны от центральной оси
  // Правая цепочка (Хесед/Нецах) — вправо, левая (Гвура/Ход) — влево
  const baseRadius = 1.8 * scale;
  const centerX = side * baseRadius * 0.4; // смещение цепочки от оси

  for (let i = 0; i <= segments; i++) {
    const s = -1 + (2 * i) / segments; // −1 … +1
    const y = s * halfHeight;

    // Зеркальная антисимметрия витков:
    // левая и правая цепочки зеркальны по фазовой структуре
    const theta = turns * Math.PI * s * side;

    // Радиус витка сужается к центру (область S-петли)
    const r = baseRadius * (0.3 + 0.7 * Math.abs(s));

    const x = centerX + r * Math.cos(theta);
    const z = r * Math.sin(theta) * side;

    points.push(new THREE.Vector3(x, y, z));
  }

  return points;
}

// Полная модель Вселенной: все фрактальные уровни, обе цепочки
function buildUniverseGeometry(fractalLevels: boolean[]): Float32Array {
  const positions: number[] = [];

  const scales = [1, 0.5, 0.25];
  const nodeCounts = [144, 288, 576]; // из структуры модели

  scales.forEach((scale, levelIdx) => {
    if (!fractalLevels[levelIdx]) return;

    // Число витков и детализация зависят от фрактального уровня
    const turns = 2.2 + levelIdx * 0.5;
    const segments = Math.max(24, 60 - levelIdx * 15);

    // Две зеркальные цепочки (правая и левая)
    const sides: (1 | -1)[] = [1, -1];

    sides.forEach((side) => {
      // Для каждого уровня генерируем несколько цепочек,
      // повёрнутых вокруг центральной оси (окружности витков)
      const chainsPerLevel = levelIdx === 0 ? 6 : levelIdx === 1 ? 4 : 2;

      for (let c = 0; c < chainsPerLevel; c++) {
        const angleOffset = (c / chainsPerLevel) * Math.PI * 2;

        const chainPoints = generateChainPoints({ scale, side, turns, segments });

        // Поворот цепочки вокруг центральной оси Y
        const cos = Math.cos(angleOffset);
        const sin = Math.sin(angleOffset);

        const rotated = chainPoints.map((p) => {
          const rx = p.x * cos - p.z * sin;
          const rz = p.x * sin + p.z * cos;
          return new THREE.Vector3(rx, p.y, rz);
        });

        // Добавляем сегменты
        for (let i = 0; i < rotated.length - 1; i++) {
          positions.push(
            rotated[i].x, rotated[i].y, rotated[i].z,
            rotated[i + 1].x, rotated[i + 1].y, rotated[i + 1].z
          );
        }
      }
    });
  });

  return new Float32Array(positions);
}

// Полупрозрачная модель Вселенной, совмещённая с Древом
function UniverseModel({ fractalLevels, opacity }: { fractalLevels: boolean[]; opacity: number }) {
  const geometry = useMemo(() => {
    const positions = buildUniverseGeometry(fractalLevels);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [fractalLevels]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#7dd3fc" transparent opacity={opacity} />
    </lineSegments>
  );
}

/* ============================================================
   АКТИВНАЯ СФИРАЛЬНАЯ ТРАЕКТОРИЯ
   ИСПРАВЛЕНИЕ: траектория идёт вдоль центральной оси Древа,
   а не на периферии окружности.
   ============================================================ */

function ActiveSfiralTrajectory({ phase, side }: { phase: number; side: 1 | -1 }) {
  const curve = useMemo(() => {
    const points = generateChainPoints({
      scale: 1,
      side,
      turns: 2.2,
      segments: 80
    });
    return new THREE.CatmullRomCurve3(points);
  }, [side]);

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
        <tubeGeometry args={[curve, 100, 0.04, 8, false]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#b45309"
          emissiveIntensity={1.2}
          transparent
          opacity={0.95}
        />
      </mesh>

      <mesh ref={pointRef}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2.5} />
      </mesh>
    </group>
  );
}

/* ============================================================
   ДРЕВО СФИРОТ
   ============================================================ */

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
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshBasicMaterial
          color={sefirah.color}
          transparent
          opacity={isSelected ? 0.35 : 0.14}
        />
      </mesh>

      <mesh ref={meshRef} onClick={onClick}>
        <sphereGeometry args={[0.26, 32, 32]} />
        <meshStandardMaterial
          color={sefirah.color}
          emissive={sefirah.color}
          emissiveIntensity={isSelected ? 1.6 : 0.55}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>

      <Text position={[0, 0, 0.32]} fontSize={0.18} color="#05070f" anchorX="center" anchorY="middle" fontWeight={700}>
        {sefirah.id}
      </Text>

      <Text position={[0, -0.5, 0]} fontSize={0.15} color="#f5f1e8" anchorX="center" anchorY="middle">
        {sefirah.name}
      </Text>

      <Text position={[0, -0.7, 0]} fontSize={0.12} color="#b8b2a7" anchorX="center" anchorY="middle">
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

// Центральная ось инверсии (совпадает с продольной осью Сфиралей)
function CentralAxis() {
  return (
    <Line
      points={[[0, -7, 0], [0, 7, 0]]}
      color="#d4af37"
      lineWidth={1}
      transparent
      opacity={0.2}
      dashed
      dashSize={0.2}
      gapSize={0.15}
    />
  );
}

/* ============================================================
   ГЛАВНАЯ СЦЕНА
   ИСПРАВЛЕНИЕ: камера и пропорции под вертикальную геометрию
   ============================================================ */

interface Props {
  selectedSefira: number | null;
  onSelectSefira: (id: number) => void;
  sfiralPhase: number;
  activeSide: 1 | -1;
  fractalLevels: boolean[];
  universeOpacity: number;
}

export default function UnifiedTreeSfiral3D({
  selectedSefira,
  onSelectSefira,
  sfiralPhase,
  activeSide,
  fractalLevels,
  universeOpacity
}: Props) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{
          position: [0, 0, 22],
          fov: 50,
          near: 0.1,
          far: 200
        }}
      >
        <color attach="background" args={['#0f172a']} />
        <Stars radius={80} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />

        <ambientLight intensity={0.6} />
        <pointLight position={[-10, 10, 10]} intensity={1.4} color="#38bdf8" />
        <pointLight position={[10, -10, 10]} intensity={1.4} color="#a78bfa" />
        <pointLight position={[0, 0, 12]} intensity={1} color="#fbbf24" />

        {/* Центральная ось инверсии = продольная ось Сфиралей */}
        <CentralAxis />

        {/* Полупрозрачная модель Вселенной, совмещённая с Древом */}
        <UniverseModel fractalLevels={fractalLevels} opacity={universeOpacity} />

        {/* Активная сфиральная траектория (вдоль центральной оси, не на периферии) */}
        <ActiveSfiralTrajectory phase={sfiralPhase} side={activeSide} />

        {/* Древо Сфирот */}
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
          autoRotate={false}
          minDistance={5}
          maxDistance={60}
        />
      </Canvas>
    </div>
  );
}
