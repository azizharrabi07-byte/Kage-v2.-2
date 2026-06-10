import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, TorusKnot } from '@react-three/drei';
import * as THREE from 'three';

function GalaxyParticles({ count = 400 }) {
  const ref = useRef<THREE.Points>(null);
  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 2 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.4;
      pos[i * 3 + 2] = r * Math.cos(phi);
      const t = Math.random();
      col[i * 3] = 0.89 + t * 0.11;
      col[i * 3 + 1] = 0.12 + t * 0.15;
      col[i * 3 + 2] = 0.14 + t * 0.1;
      siz[i] = 0.02 + Math.random() * 0.06;
    }
    return [pos, col, siz];
  }, [count]);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.03;
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.01) * 0.05;
    }
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} vertexColors sizeAttenuation transparent opacity={0.8} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function FloatingGeo({ data, index }: { data: any; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += data.rotSpeed * 0.01;
      meshRef.current.rotation.y += data.rotSpeed * 0.015;
      meshRef.current.position.y = data.pos[1] + Math.sin(clock.getElapsedTime() * data.floatSpeed + index) * data.floatAmp;
    }
  });
  const geo = useMemo(() => {
    switch (data.type) {
      case 'box': return new THREE.BoxGeometry(data.args[0], data.args[1], data.args[2]);
      case 'octa': return new THREE.OctahedronGeometry(data.args[0], data.args[1]);
      case 'tetra': return new THREE.TetrahedronGeometry(data.args[0], data.args[1]);
      default: return new THREE.IcosahedronGeometry(data.args[0], data.args[1]);
    }
  }, [data.type, data.args]);
  return (
    <mesh ref={meshRef} position={data.pos}>
      <primitive object={geo} attach="geometry" />
      <meshBasicMaterial color={data.color} transparent opacity={data.opacity} wireframe />
    </mesh>
  );
}

function FloatingGeometries() {
  const group = useRef<THREE.Group>(null);
  const meshes = useMemo(() => {
    const types = ['ico', 'octa', 'tetra', 'box'] as const;
    const argsMap: Record<string, number[]> = { ico: [0.15, 0], octa: [0.12, 0], tetra: [0.18, 0], box: [0.12, 0.12, 0.12] };
    return Array.from({ length: 12 }, (_, i) => {
      const type = types[i % 4];
      return {
        type, args: argsMap[type],
        pos: [(Math.random() - 0.5) * 8, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 6 - 2],
        rotSpeed: 0.2 + Math.random() * 0.5,
        floatSpeed: 0.3 + Math.random() * 0.5,
        floatAmp: 0.1 + Math.random() * 0.2,
        color: i % 3 === 0 ? '#E31E24' : i % 3 === 1 ? '#FF6B35' : '#22D3EE',
        opacity: 0.15 + Math.random() * 0.2,
      };
    });
  }, []);
  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.y = clock.getElapsedTime() * 0.02;
  });
  return (
    <group ref={group}>
      {meshes.map((m, i) => <FloatingGeo key={i} data={m} index={i} />)}
    </group>
  );
}

function EnergyCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.15;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.25;
    }
  });
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <MeshDistortMaterial
          color="#E31E24"
          emissive="#E31E24"
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.9}
          distort={0.4}
          speed={3}
        />
      </Sphere>
    </Float>
  );
}

function InnerCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * -0.2;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.35;
      const s = 1 + Math.sin(clock.getElapsedTime() * 0.5) * 0.05;
      meshRef.current.scale.setScalar(s);
    }
  });
  return (
    <Sphere ref={meshRef} args={[0.35, 32, 32]}>
      <MeshDistortMaterial
        color="#FF6B35"
        emissive="#FF4500"
        emissiveIntensity={1.5}
        roughness={0}
        metalness={0.3}
        distort={0.6}
        speed={4}
        transparent
        opacity={0.9}
      />
    </Sphere>
  );
}

function EnergyRings() {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);
  const ring4 = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ring1.current) { ring1.current.rotation.x = t * 0.3; ring1.current.rotation.z = t * 0.2; ring1.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.05); }
    if (ring2.current) { ring2.current.rotation.x = -t * 0.2; ring2.current.rotation.z = t * 0.3; ring2.current.scale.setScalar(1 + Math.sin(t * 0.7 + 1) * 0.04); }
    if (ring3.current) { ring3.current.rotation.x = t * 0.15; ring3.current.rotation.y = t * 0.1; ring3.current.scale.setScalar(1 + Math.sin(t * 0.3 + 2) * 0.06); }
    if (ring4.current) { ring4.current.rotation.x = t * 0.4; ring4.current.rotation.y = t * 0.25; ring4.current.scale.setScalar(1 + Math.sin(t * 0.6 + 3) * 0.03); }
  });
  return (
    <>
      <mesh ref={ring1}>
        <torusGeometry args={[1.6, 0.025, 16, 80]} />
        <meshBasicMaterial color="#E31E24" transparent opacity={0.5} />
      </mesh>
      <mesh ref={ring2}>
        <torusGeometry args={[2.0, 0.02, 16, 80]} />
        <meshBasicMaterial color="#22D3EE" transparent opacity={0.35} />
      </mesh>
      <mesh ref={ring3}>
        <torusGeometry args={[2.4, 0.015, 16, 80]} />
        <meshBasicMaterial color="#FF6B35" transparent opacity={0.2} />
      </mesh>
      <mesh ref={ring4}>
        <ringGeometry args={[2.8, 2.85, 64]} />
        <meshBasicMaterial color="#E31E24" transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}

function TorusKnotGlow() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = clock.getElapsedTime() * 0.1;
      ref.current.rotation.y = clock.getElapsedTime() * 0.15;
    }
  });
  return (
    <Float speed={0.5} floatIntensity={0.2}>
      <TorusKnot ref={ref} args={[1.8, 0.4, 64, 8]}>
        <meshBasicMaterial color="#E31E24" transparent opacity={0.06} wireframe />
      </TorusKnot>
    </Float>
  );
}

function GlowField() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = clock.getElapsedTime() * 0.01;
      (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.06 + Math.sin(clock.getElapsedTime() * 0.1) * 0.03;
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[3.5, 32, 32]} />
      <meshBasicMaterial color="#E31E24" transparent opacity={0.06} side={THREE.BackSide} />
    </mesh>
  );
}

function ShootingStars() {
  const count = 6;
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 12;
    return pos;
  }, []);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.01;
    }
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#ffffff" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

export function EnergySphereScene({ isLight }: { isLight?: boolean }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }}>
        <ambientLight intensity={isLight ? 0.8 : 0.3} />
        <pointLight position={[5, 5, 5]} intensity={isLight ? 0.5 : 1.5} />
        <pointLight position={[-3, -2, 1]} intensity={isLight ? 0.2 : 0.5} color="#22D3EE" />
        <GlowField />
        <GalaxyParticles />
        <FloatingGeometries />
        <EnergyCore />
        <InnerCore />
        <EnergyRings />
        <TorusKnotGlow />
        <ShootingStars />
      </Canvas>
    </div>
  );
}
