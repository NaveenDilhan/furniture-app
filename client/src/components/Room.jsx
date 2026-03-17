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

  const wallThickness = 0.2;
  const wallHeight = 5;

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial map={texture} />
      </mesh>
      
      {/* Back Wall - Moved outward so the inner face is perfectly at -depth/2 */}
      <mesh position={[0, wallHeight / 2, -depth / 2 - wallThickness / 2]} receiveShadow castShadow>
        <boxGeometry args={[width + wallThickness * 2, wallHeight, wallThickness]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Left Wall - Moved outward so the inner face is perfectly at -width/2 */}
      <mesh position={[-width / 2 - wallThickness / 2, wallHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[depth, wallHeight, wallThickness]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Right Wall - Moved outward so the inner face is perfectly at width/2 */}
      <mesh position={[width / 2 + wallThickness / 2, wallHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[depth, wallHeight, wallThickness]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
    </group>
  );
}

// Preload to prevent blinking
useLoader.preload(THREE.TextureLoader, '/textures/wood_floor.jpg');