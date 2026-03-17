import React from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';

export default function Room({
  width,
  depth,
  wallColor,
  wallTexture,
  floorTexture,
  is2D // Accept the new is2D prop
}) {
  const [floorMap, wallMap] = useLoader(THREE.TextureLoader, [
    floorTexture || '/textures/wood_floor.jpg',
    wallTexture || '/textures/wall_paint.jpg',
  ]);

  // Floor texture settings
  floorMap.wrapS = floorMap.wrapT = THREE.RepeatWrapping;
  floorMap.repeat.set(width / 2, depth / 2);
  floorMap.anisotropy = 16;
  floorMap.colorSpace = THREE.SRGBColorSpace;

  // Wall texture settings
  wallMap.wrapS = wallMap.wrapT = THREE.RepeatWrapping;
  wallMap.repeat.set(4, 2);
  wallMap.anisotropy = 16;
  wallMap.colorSpace = THREE.SRGBColorSpace;

  return (
    <group>
      {/* Floor is always visible */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial map={floorMap} />
      </mesh>

      {/* Hide walls if in 2D mode to create a pure flat floor-plan */}
      {!is2D && (
        <>
          {/* Back Wall */}
          <mesh position={[0, 2.5, -depth / 2]} receiveShadow>
            <boxGeometry args={[width, 5, 0.2]} />
            <meshStandardMaterial map={wallMap} color={wallColor} />
          </mesh>

          {/* Left Wall */}
          <mesh
            position={[-width / 2, 2.5, 0]}
            rotation={[0, Math.PI / 2, 0]}
            receiveShadow
          >
            <boxGeometry args={[depth, 5, 0.2]} />
            <meshStandardMaterial map={wallMap} color={wallColor} />
          </mesh>

          {/* Right Wall */}
          <mesh
            position={[width / 2, 2.5, 0]}
            rotation={[0, Math.PI / 2, 0]}
            receiveShadow
          >
            <boxGeometry args={[depth, 5, 0.2]} />
            <meshStandardMaterial map={wallMap} color={wallColor} />
          </mesh>
        </>
      )}
    </group>
  );
}

// Preload floor textures
useLoader.preload(THREE.TextureLoader, '/textures/wood_floor.jpg');
useLoader.preload(THREE.TextureLoader, '/textures/tile_floor.jpg');
useLoader.preload(THREE.TextureLoader, '/textures/marble_floor.jpg');
useLoader.preload(THREE.TextureLoader, '/textures/concrete_floor.jpg');

// Preload wall textures
useLoader.preload(THREE.TextureLoader, '/textures/wall_paint.jpg');
useLoader.preload(THREE.TextureLoader, '/textures/brick_wall.jpg');
useLoader.preload(THREE.TextureLoader, '/textures/concrete_wall.jpg');
useLoader.preload(THREE.TextureLoader, '/textures/wallpaper_wall.jpg');
useLoader.preload(THREE.TextureLoader, '/textures/wood_panel_wall.jpg');