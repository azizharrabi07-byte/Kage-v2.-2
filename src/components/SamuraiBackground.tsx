import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

/** ─── Aura Particles ─── */
function AuraParticles({ count = 120 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 2.2 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.cos(phi) * 1.2;
      pos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      const t = Math.random();
      col[i * 3] = 0.89 + t * 0.1;
      col[i * 3 + 1] = 0.1 + t * 0.08;
      col[i * 3 + 2] = 0.12 + t * 0.06;
    }
    return [pos, col];
  }, [count]);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.04;
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.008) * 0.03;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        sizeAttenuation
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** ─── Ground Glow Ring ─── */
function GroundRing() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      (ref.current.material as THREE.MeshBasicMaterial).opacity =
        0.08 + Math.sin(clock.getElapsedTime() * 0.3) * 0.04;
    }
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.15, 0]}>
      <ringGeometry args={[0.8, 1.6, 48]} />
      <meshBasicMaterial color="#E31E24" transparent opacity={0.08} side={THREE.DoubleSide} />
    </mesh>
  );
}

/** ─── Procedural Samurai Model ─── */
function SamuraiModel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Slow, subtle sway
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.15;
      const breathe = Math.sin(clock.getElapsedTime() * 0.4) * 0.008;
      groupRef.current.position.y = breathe;
    }
  });

  // Materials
  const armorMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1a1a1a',
    metalness: 0.7,
    roughness: 0.4,
    emissive: '#E31E24',
    emissiveIntensity: 0.05,
  }), []);

  const accentMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#E31E24',
    metalness: 0.9,
    roughness: 0.2,
    emissive: '#E31E24',
    emissiveIntensity: 0.15,
  }), []);

  const darkMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#0d0d0d',
    metalness: 0.5,
    roughness: 0.6,
  }), []);

  const glowMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#FF6B35',
    emissive: '#FF4500',
    emissiveIntensity: 0.4,
    metalness: 0.3,
    roughness: 0.3,
    transparent: true,
    opacity: 0.6,
  }), []);

  const bladeMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#888899',
    metalness: 0.95,
    roughness: 0.15,
    emissive: '#E31E24',
    emissiveIntensity: 0.02,
  }), []);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* ── Legs ── */}
      <group position={[-0.2, -0.4, 0]}>
        {/* Left leg */}
        <mesh position={[0, -0.35, 0]} material={darkMat}>
          <cylinderGeometry args={[0.12, 0.14, 0.7, 8]} />
        </mesh>
        {/* Left foot */}
        <mesh position={[0.05, -0.72, 0.08]} material={darkMat}>
          <boxGeometry args={[0.2, 0.1, 0.35]} />
        </mesh>
      </group>
      <group position={[0.2, -0.4, 0]}>
        {/* Right leg */}
        <mesh position={[0, -0.35, 0]} material={darkMat}>
          <cylinderGeometry args={[0.12, 0.14, 0.7, 8]} />
        </mesh>
        {/* Right foot */}
        <mesh position={[-0.05, -0.72, 0.08]} material={darkMat}>
          <boxGeometry args={[0.2, 0.1, 0.35]} />
        </mesh>
      </group>

      {/* ── Do (chest armor) ── */}
      <mesh position={[0, 0.05, 0]} material={armorMat}>
        <boxGeometry args={[0.65, 0.6, 0.35]} />
      </mesh>

      {/* Chest plate detail */}
      <mesh position={[0, 0.08, 0.19]} material={accentMat}>
        <boxGeometry args={[0.35, 0.3, 0.02]} />
      </mesh>

      {/* Center emblem */}
      <mesh position={[0, 0.08, 0.21]} material={glowMat}>
        <boxGeometry args={[0.08, 0.08, 0.02]} />
      </mesh>

      {/* ── Sode (shoulder armor) ── */}
      <mesh position={[-0.44, 0.35, 0]} rotation={[0, 0, -0.2]} material={armorMat}>
        <boxGeometry args={[0.2, 0.35, 0.28]} />
      </mesh>
      <mesh position={[0.44, 0.35, 0]} rotation={[0, 0, 0.2]} material={armorMat}>
        <boxGeometry args={[0.2, 0.35, 0.28]} />
      </mesh>

      {/* Sode accent stripes */}
      <mesh position={[-0.44, 0.35, 0.15]} rotation={[0, 0, -0.2]} material={accentMat}>
        <boxGeometry args={[0.04, 0.28, 0.02]} />
      </mesh>
      <mesh position={[0.44, 0.35, 0.15]} rotation={[0, 0, 0.2]} material={accentMat}>
        <boxGeometry args={[0.04, 0.28, 0.02]} />
      </mesh>

      {/* ── Arms ── */}
      {/* Left arm */}
      <group position={[-0.5, 0.15, 0]}>
        <mesh position={[0, -0.2, 0]} material={darkMat}>
          <cylinderGeometry args={[0.08, 0.09, 0.4, 6]} />
        </mesh>
        {/* Left hand */}
        <mesh position={[0, -0.42, 0]} material={darkMat}>
          <sphereGeometry args={[0.06, 6, 6]} />
        </mesh>
      </group>
      {/* Right arm */}
      <group position={[0.5, 0.15, 0]}>
        <mesh position={[0, -0.2, 0]} material={darkMat}>
          <cylinderGeometry args={[0.08, 0.09, 0.4, 6]} />
        </mesh>
        {/* Right hand */}
        <mesh position={[0, -0.42, 0]} material={darkMat}>
          <sphereGeometry args={[0.06, 6, 6]} />
        </mesh>
      </group>

      {/* ── Katana (at left hip) ── */}
      <group position={[-0.35, -0.25, 0.2]} rotation={[0.3, -0.1, 0.4]}>
        {/* Saya (scabbard) */}
        <mesh position={[0, -0.5, 0]} material={armorMat}>
          <boxGeometry args={[0.04, 1.0, 0.04]} />
        </mesh>
        {/* Tsuka (handle) */}
        <mesh position={[0, 0.25, 0]} material={darkMat}>
          <cylinderGeometry args={[0.035, 0.04, 0.25, 6]} />
        </mesh>
        {/* Tsuba (guard) */}
        <mesh position={[0, 0.13, 0]} material={accentMat}>
          <boxGeometry args={[0.12, 0.02, 0.04]} />
        </mesh>
      </group>

      {/* ── Neck ── */}
      <mesh position={[0, 0.38, 0]} material={darkMat}>
        <cylinderGeometry args={[0.09, 0.11, 0.12, 8]} />
      </mesh>

      {/* ── Head / Kabuto (Helmet) ── */}
      {/* Head base */}
      <mesh position={[0, 0.52, 0]} material={armorMat}>
        <sphereGeometry args={[0.18, 12, 12]} />
      </mesh>

      {/* Helmet dome (hachi) */}
      <mesh position={[0, 0.56, 0]} material={armorMat}>
        <sphereGeometry args={[0.2, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} rotation={[0, 0, 0]} />
      </mesh>

      {/* Shikoro (neck guard - layered plates) */}
      <mesh position={[0, 0.46, -0.15]} material={accentMat}>
        <boxGeometry args={[0.3, 0.04, 0.06]} />
      </mesh>
      <mesh position={[0, 0.42, -0.16]} material={accentMat}>
        <boxGeometry args={[0.28, 0.04, 0.06]} />
      </mesh>

      {/* Maedate (front crest - crescent) */}
      <mesh position={[0, 0.72, 0.1]} rotation={[0.2, 0, 0]} material={glowMat}>
        <boxGeometry args={[0.01, 0.18, 0.01]} />
      </mesh>
      <mesh position={[0.08, 0.68, 0.1]} rotation={[0.2, 0, 0.4]} material={glowMat}>
        <boxGeometry args={[0.01, 0.14, 0.01]} />
      </mesh>
      <mesh position={[-0.08, 0.68, 0.1]} rotation={[0.2, 0, -0.4]} material={glowMat}>
        <boxGeometry args={[0.01, 0.14, 0.01]} />
      </mesh>

      {/* Maedate base */}
      <mesh position={[0, 0.65, 0.1]} material={accentMat}>
        <boxGeometry args={[0.06, 0.03, 0.03]} />
      </mesh>

      {/* Menpo (face mask hint) */}
      <mesh position={[0, 0.52, 0.16]} material={armorMat}>
        <boxGeometry args={[0.12, 0.08, 0.02]} />
      </mesh>

      {/* Helmet side flares */}
      <mesh position={[-0.16, 0.55, 0]} rotation={[0, 0, -0.3]} material={armorMat}>
        <boxGeometry args={[0.04, 0.1, 0.16]} />
      </mesh>
      <mesh position={[0.16, 0.55, 0]} rotation={[0, 0, 0.3]} material={armorMat}>
        <boxGeometry args={[0.04, 0.1, 0.16]} />
      </mesh>

      {/* Eye slits (glowing) */}
      <mesh position={[-0.06, 0.54, 0.18]} material={glowMat}>
        <boxGeometry args={[0.04, 0.02, 0.01]} />
      </mesh>
      <mesh position={[0.06, 0.54, 0.18]} material={glowMat}>
        <boxGeometry args={[0.04, 0.02, 0.01]} />
      </mesh>
    </group>
  );
}

/** ─── Main Scene ─── */
function SamuraiScene() {
  return (
    <>
      {/* Atmosphere */}
      <fog attach="fog" args={['#0A0A0F', 3, 8]} />
      <color attach="background" args={['#0A0A0F']} />

      {/* Lighting */}
      <ambientLight intensity={0.3} color="#E31E24" />
      <directionalLight position={[2, 3, 4]} intensity={0.8} color="#FF6B35" />
      <directionalLight position={[-3, 1, -2]} intensity={0.3} color="#22D3EE" />
      <pointLight position={[0, 1.5, 1]} intensity={0.5} color="#E31E24" distance={5} decay={2} />
      <pointLight position={[0, -0.5, 0]} intensity={0.3} color="#E31E24" distance={4} decay={2} />

      {/* Ground ring */}
      <GroundRing />

      {/* Procedural Samurai */}
      <Float speed={0.8} rotationIntensity={0.05} floatIntensity={0.15}>
        <SamuraiModel />
      </Float>

      {/* Aura particles */}
      <AuraParticles count={100} />
    </>
  );
}

/** ─── Exported SamuraiBackground ─── */
export const SamuraiBackground = React.memo(function SamuraiBackground({ isLight }: { isLight?: boolean }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0.2, 3.2], fov: 40 }}>
        <SamuraiScene />
      </Canvas>
    </div>
  );
});

export default SamuraiBackground;
