import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Tube, Sphere, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import { sefirot } from '../data/sefirot';
import { treeEdges } from '../data/treeEdges';

interface Props {
  selected: number | null;
  onSelect: (id: number) => void;
  sfiralS: number;
}

// Правильная геометрия Сфирали из Sfiralium-Core
// V⁻: r(s) = (R·cos(θ+φ), R·sin(θ+φ), z₀+kz·θ)
// V⁺: r⁺(s) = M·r⁻(−s) + c (зеркальная антисимметрия)
// R(s) = α(s)·r⁻(s) + β(s)·r⁺(s) - S-петля

function generateSfiralGeometry() {
  const R_coil = 4.0;
  const R_arc = R_coil / 2.0;
  const Height_Coil = 3.0;
  const Height_S = 1.0;
  const Turns = 1.2;
  const Resolution = 300;

  // Part 1: S-Arc Right (переход к V+)
  const s_arc_right: THREE.Vector3[] = [];
  const res_arc = Math.floor(Resolution * 0.3);
  for (let i = 0; i <= res_arc; i++) {
    const t = i / res_arc;
    const phi = Math.PI * (1 - t);
    const x = R_arc + R_arc * Math.cos(phi);
    const y = -R_arc * Math.sin(phi);
    const z = (Height_S / 2) * t;
    s_arc_right.push(new THREE.Vector3(x, y, z));
  }

  // Part 2: Main Coil Right (V+ виток - будущее)
  const coil_right: THREE.Vector3[] = [];
  const res_coil = Math.floor(Resolution * 0.7);
  const z_start_coil = Height_S / 2;
  for (let i = 1; i <= res_coil; i++) {
    const t = i / res_coil;
    const theta = Turns * 2 * Math.PI * t;
    const x = R_coil * Math.cos(theta);
    const y = R_coil * Math.sin(theta);
    const z = z_start_coil + Height_Coil * t;
    coil_right.push(new THREE.Vector3(x, y, z));
  }

  // Зеркальная антисимметрия: V- (прошлое) = M · V+(−s)
  const s_arc_left: THREE.Vector3[] = [];
  for (let i = s_arc_right.length - 1; i >= 0; i--) {
    const p = s_arc_right[i];
    s_arc_left.push(new THREE.Vector3(-p.x, -p.y, -p.z));
  }

  const coil_left: THREE.Vector3[] = [];
  for (let i = coil_right.length - 1; i >= 0; i--) {
    const p = coil_right[i];
    coil_left.push(new THREE.Vector3(-p.x, -p.y, -p.z));
  }

  // Непрерывные пути
  // V- (левый виток) = coil_left → начало s_arc_left
  const vMinusPath = coil_left.concat(s_arc_left.slice(0, 2));
  // S-петля = s_arc_left → s_arc_right (через центр!)
  const sLoopPath = s_arc_left.concat(s_arc_right);
  // V+ (правый виток) = конец s_arc_right → coil_right
  const vPlusPath = [s_arc_right[s_arc_right.length - 1]].concat(coil_right);

  return { vMinusPath, vPlusPath, sLoopPath, centralPoint: new THREE.Vector3(0, 0, 0) };
}

// Виток Сфирали (V- или V+)
function SfiralCoil({
  path,
  color,
  emissive
}: {
  path: THREE.Vector3[];
  color: string;
  emissive: string;
}) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(path), [path]);

  return (
    <Tube
      args={[curve, 100, 0.12, 12, false]}
    >
      <meshPhongMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={0.4}
        shininess={100}
        transparent
        opacity={0.9}
      />
    </Tube>
  );
}

// S-петля фазового перехода (золотая, соединяет V- и V+)
function SfiralLoop({ path }: { path: THREE.Vector3[] }) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(path), [path]);

  return (
    <Tube args={[curve, 80, 0.15, 12, false]}>
      <meshPhongMaterial
        color="#fbbf24"
        emissive="#b45309"
        emissiveIntensity={0.7}
        shininess={120}
      />
    </Tube>
  );
}

// Центральный узел (Тиферет / Даат) - точка инверсии
function CentralNode() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.15;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.45, 32, 32]} />
      <meshPhongMaterial
        color="#fbbf24"
        emissive="#f59e0b"
        emissiveIntensity={0.9}
      />
    </mesh>
  );
}

// Движущаяся точка по сфиральному времени s
function MovingPhasePoint({ s }: { s: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { vMinusPath, sLoopPath, vPlusPath } = useMemo(generateSfiralGeometry, []);

  useFrame(() => {
    if (!meshRef.current) return;

    // Интерполяция положения по параметру s ∈ [-1, 1]
    let pos: THREE.Vector3;

    if (s <= -0.33) {
      // V- виток
      const t = (s + 1) / 0.67; // 0 to 1
      const idx = Math.floor(t * (vMinusPath.length - 1));
      pos = vMinusPath[Math.max(0, Math.min(idx, vMinusPath.length - 1))];
    } else if (s >= 0.33) {
      // V+ виток
      const t = (s - 0.33) / 0.67; // 0 to 1
      const idx = Math.floor(t * (vPlusPath.length - 1));
      pos = vPlusPath[Math.max(0, Math.min(idx, vPlusPath.length - 1))];
    } else {
      // S-петля (фаза инверсии)
      const t = (s + 0.33) / 0.66; // 0 to 1
      const idx = Math.floor(t * (sLoopPath.length - 1));
      pos = sLoopPath[Math.max(0, Math.min(idx, sLoopPath.length - 1))];
    }

    meshRef.current.position.copy(pos);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.25, 32, 32]} />
      <meshPhongMaterial
        color="#ffffff"
        emissive="#ffffff"
        emissiveIntensity={2}
      />
    </mesh>
  );
}

// Сфира как узел в сфиральном пространстве
function SefiraNode({
  sefirah,
  isSelected,
  onClick
}: {
  sefirah: (typeof sefirot)[number];
  isSelected: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Расположение сфирот в сфиральной топологии:
  // Кетер - верх над V+
  // Тиферет - центр S-петли (0,0,0)
  // Малхут - низ под V-
  const getSefiraPosition = (id: number): [number, number, number] => {
    switch (id) {
      case 1: return [0, 6, 0];      // Кетер - над V+
      case 2: return [2.5, 4.5, 1];  // Хохма - на V+
      case 3: return [-2.5, 4.5, -1]; // Бина - зеркально
      case 4: return [3, 2, 1.5];    // Хесед - правая колонна
      case 5: return [-3, 2, -1.5];  // Гвура - левая колонна
      case 6: return [0, 0, 0];      // Тиферет - ЦЕНТР S-петли
      case 7: return [2.5, -2, 1];   // Нецах
      case 8: return [-2.5, -2, -1]; // Ход
      case 9: return [0, -4, 0];     // Йесод
      case 10: return [0, -6, 0];    // Малхут - под V-
      default: return [0, 0, 0];
    }
  };

  const position = getSefiraPosition(sefirah.id);

  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.8;
    }
  });

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial
          color={sefirah.color}
          transparent
          opacity={isSelected ? 0.35 : 0.15}
        />
      </mesh>

      <mesh ref={meshRef} onClick={onClick}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial
          color={sefirah.color}
          emissive={sefirah.color}
          emissiveIntensity={isSelected ? 1.5 : 0.5}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>

      <Text
        position={[0, 0, 0.4]}
        fontSize={0.25}
        color="#05070f"
        anchorX="center"
        anchorY="middle"
        fontWeight={700}
      >
        {sefirah.id}
      </Text>

      <Text
        position={[0, -0.65, 0]}
        fontSize={0.2}
        color="#f5f1e8"
        anchorX="center"
        anchorY="middle"
      >
        {sefirah.name}
      </Text>

      <Text
        position={[0, -0.9, 0]}
        fontSize={0.17}
        color="#b8b2a7"
        anchorX="center"
        anchorY="middle"
      >
        {sefirah.hebrew}
      </Text>
    </group>
  );
}

// Пути между сфиротами (22 пути Древа)
function TreePaths({ selected }: { selected: number | null }) {
  const getSefiraPosition = (id: number): [number, number, number] => {
    switch (id) {
      case 1: return [0, 6, 0];
      case 2: return [2.5, 4.5, 1];
      case 3: return [-2.5, 4.5, -1];
      case 4: return [3, 2, 1.5];
      case 5: return [-3, 2, -1.5];
      case 6: return [0, 0, 0];
      case 7: return [2.5, -2, 1];
      case 8: return [-2.5, -2, -1];
      case 9: return [0, -4, 0];
      case 10: return [0, -6, 0];
      default: return [0, 0, 0];
    }
  };

  return (
    <>
      {treeEdges.map(([from, to], index) => {
        const active = selected !== null && (selected === from || selected === to);
        const p1 = getSefiraPosition(from);
        const p2 = getSefiraPosition(to);

        return (
          <line key={index}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([...p1, ...p2])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color={active ? '#ffffff' : '#d4af37'}
              transparent
              opacity={active ? 1 : 0.4}
              linewidth={active ? 2 : 1}
            />
          </line>
        );
      })}
    </>
  );
}

// Подписи зон
function ZoneLabels() {
  return (
    <>
      <Html position={[5, -3, 0]}>
        <div style={{ color: '#38bdf8', fontSize: 14, whiteSpace: 'nowrap', textShadow: '0 0 8px #38bdf8' }}>
          V⁻ (прошлое)
        </div>
      </Html>
      <Html position={[-5, 3, 0]}>
        <div style={{ color: '#a78bfa', fontSize: 14, whiteSpace: 'nowrap', textShadow: '0 0 8px #a78bfa' }}>
          V⁺ (будущее)
        </div>
      </Html>
      <Html position={[2.5, 0, 0]}>
        <div style={{ color: '#fbbf24', fontSize: 14, whiteSpace: 'nowrap', textShadow: '0 0 8px #fbbf24' }}>
          S-петля (инверсия)
        </div>
      </Html>
    </>
  );
}

// Главная сцена
export default function UnifiedTreeSfiral3D({ selected, onSelect, sfiralS }: Props) {
  const { vMinusPath, vPlusPath, sLoopPath } = useMemo(generateSfiralGeometry, []);

  return (
    <div style={{ height: 700, borderRadius: 20, overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 2, 14], fov: 55 }}>
        <color attach="background" args={['#0f172a']} />
        <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />

        <ambientLight intensity={0.6} />
        <pointLight position={[-10, 10, 10]} intensity={1.5} color="#38bdf8" />
        <pointLight position={[10, -10, 10]} intensity={1.5} color="#a78bfa" />
        <pointLight position={[0, 0, 8]} intensity={1} color="#fbbf24" />

        {/* Настоящая Сфираль: два зеркальных витка + S-петля */}
        <SfiralCoil path={vMinusPath} color="#38bdf8" emissive="#1e40af" />
        <SfiralCoil path={vPlusPath} color="#a78bfa" emissive="#5b21b6" />
        <SfiralLoop path={sLoopPath} />

        {/* Центральный узел (Тиферет / Даат) */}
        <CentralNode />

        {/* Движущаяся точка фазы s */}
        <MovingPhasePoint s={sfiralS} />

        {/* Пути Древа Сфирот */}
        <TreePaths selected={selected} />

        {/* 10 сфирот в сфиральной топологии */}
        {sefirot.map((sefirah) => (
          <SefiraNode
            key={sefirah.id}
            sefirah={sefirah}
            isSelected={selected === sefirah.id}
            onClick={() => onSelect(sefirah.id)}
          />
        ))}

        {/* Подписи зон */}
        <ZoneLabels />

        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          autoRotate
          autoRotateSpeed={0.5}
          minDistance={5}
          maxDistance={30}
        />
      </Canvas>
    </div>
  );
}
