
import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

interface OrbProps {
  isLoading: boolean;
}

const CreationOrb: React.FC<OrbProps> = ({ isLoading }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const sparklesRef = useRef<any>(null!);
  const { viewport, mouse } = useThree();

  useFrame((state, delta) => {
    if (meshRef.current) {
      if (isLoading) {
        // Fast, energetic rotation when loading
        meshRef.current.rotation.y += delta * 3;
        meshRef.current.rotation.x += delta * 1.5;
      } else {
        // Slow, mesmerizing rotation, reacts to mouse
        meshRef.current.rotation.y += delta * 0.1;
        const x = (mouse.x * viewport.width) / 100;
        const y = (mouse.y * viewport.height) / 100;
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, y * 0.1, 0.1);
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, -x * 0.1 + meshRef.current.rotation.y, 0.05);
      }
    }
    if (sparklesRef.current) {
        sparklesRef.current.scale.setScalar(isLoading ? 1.5 : 1);
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#FFD700" />
      <Sparkles ref={sparklesRef} count={100} scale={6} size={8} speed={0.3} color="#FFD700" noise={0.2} />
      <Sphere ref={meshRef} args={[2.5, 64, 64]}>
        <meshPhysicalMaterial
          color="#111"
          transmission={0.95}
          roughness={0.1}
          thickness={2.5}
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </Sphere>
       <Sphere args={[2.55, 64, 64]}>
        <meshStandardMaterial
          color={"#FFD700"}
          emissive={"#FFD700"}
          emissiveIntensity={isLoading ? 3 : 0.5}
          wireframe={true}
          transparent
          opacity={0.15}
        />
      </Sphere>
    </>
  );
};

const Orb: React.FC<OrbProps> = (props) => {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
      <CreationOrb {...props} />
    </Canvas>
  );
};


export default Orb;
