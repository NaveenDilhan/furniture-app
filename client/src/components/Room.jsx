import React from 'react';
import * as THREE from 'three'; 
import { useLoader } from '@react-three/fiber'; 

export default function Room({ width, depth, wallColor }) {
  // Load the texture
  const texture = useLoader(THREE.TextureLoader, '/textures/wood_floor.jpg');

  // Configure the texture to repeat (tiling)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(width / 2, depth / 2);
  texture.anisotropy = 16;
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      
      {/* GRID REMOVED HERE: The floor will now be clean wood! */}

      {/* Back Wall */}
      <mesh position={[0, 2.5, -depth / 2]} receiveShadow>
        <boxGeometry args={[width, 5, 0.2]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-width / 2, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[depth, 5, 0.2]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[width / 2, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[depth, 5, 0.2]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
    </group>
  );
}

// Preload to prevent blinking
useLoader.preload(THREE.TextureLoader, '/textures/wood_floor.jpg');