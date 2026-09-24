"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function Tower({
  position,
  height,
  width = 1.2,
  depth = 1.2,
}: {
  position: [number, number, number];
  height: number;
  width?: number;
  depth?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={meshRef} position={[position[0], height / 2 + position[1], position[2]]}>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial
        color="#C4B5A0"
        roughness={0.7}
        metalness={0.1}
      />
    </mesh>
  );
}

function TowerBase() {
  return (
    <mesh position={[0, 0.15, 0]}>
      <boxGeometry args={[6, 0.3, 4]} />
      <meshStandardMaterial color="#A89880" roughness={0.8} metalness={0.05} />
    </mesh>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#D6CFC6" roughness={0.9} metalness={0} />
    </mesh>
  );
}

function RotatingGroup() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      <TowerBase />
      {/* Three towers of varying heights */}
      <Tower position={[-1.8, 0.3, 0]} height={5} width={1.3} depth={1.3} />
      <Tower position={[0, 0.3, 0]} height={7} width={1.4} depth={1.4} />
      <Tower position={[1.8, 0.3, 0]} height={6} width={1.3} depth={1.3} />
    </group>
  );
}

export default function BuildingScene() {
  return (
    <Canvas
      camera={{ position: [11, 6, 11], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: "default" }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight
        position={[6, 12, 6]}
        intensity={1.4}
        castShadow={false}
      />
      <directionalLight
        position={[-6, 8, -4]}
        intensity={0.6}
        color="#b0c4de"
      />
      <pointLight position={[0, 8, 4]} intensity={0.4} color="#ffd700" />

      <RotatingGroup />
      <Ground />

      <OrbitControls
        target={[0, 2.5, 0]}
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        autoRotate={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
      />
    </Canvas>
  );
}
