import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';

export default function Room({
  width = 10,
  depth = 10,
  wallHeight = 5,
  wallColor = '#ffffff',
  wallTexture,
  floorTexture,
  is2D,
  showFrontWall = false,
  showCeiling = false,
  showBaseboards = true
}) {
  const [floorMap, wallMap] = useLoader(THREE.TextureLoader, [
    floorTexture || '/textures/wood_floor.jpg',
    wallTexture || '/textures/wall_paint.jpg',
  ]);

  // Dynamically scale textures to prevent stretching when room resizes
  useMemo(() => {
    floorMap.wrapS = floorMap.wrapT = THREE.RepeatWrapping;
    floorMap.repeat.set(width / 2, depth / 2);
    floorMap.anisotropy = 16;
    floorMap.colorSpace = THREE.SRGBColorSpace;

    wallMap.wrapS = wallMap.wrapT = THREE.RepeatWrapping;
    // Scale wall texture based on room width/depth and height
    wallMap.repeat.set(width / 3, wallHeight / 3);
    wallMap.anisotropy = 16;
    wallMap.colorSpace = THREE.SRGBColorSpace;
  }, [floorMap, wallMap, width, depth, wallHeight]);

  const wallThickness = 0.2;
  const halfWidth = width / 2;
  const halfDepth = depth / 2;
  const halfHeight = wallHeight / 2;

  // Baseboard Dimensions
  const bbHeight = 0.15;
  const bbThickness = 0.04;

  return (
    <group>
      {/* --- FLOOR --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial 
          map={floorMap} 
          roughness={0.4} // Gives the floor a slight, realistic polish
          metalness={0.05}
        />
      </mesh>

      {/* --- CEILING --- */}
      {!is2D && showCeiling && (
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, wallHeight, 0]} receiveShadow>
          <planeGeometry args={[width, depth]} />
          <meshStandardMaterial color="#fafafa" roughness={0.9} />
        </mesh>
      )}

      {/* Hide walls if in 2D mode to create a pure flat floor-plan */}
      {!is2D && (
        <group>
          {/* Back Wall */}
          <mesh position={[0, halfHeight, -halfDepth - wallThickness / 2]} receiveShadow castShadow>
            <boxGeometry args={[width + wallThickness * 2, wallHeight, wallThickness]} />
            <meshStandardMaterial map={wallMap} color={wallColor} roughness={0.85} />
          </mesh>

          {/* Left Wall */}
          <mesh position={[-halfWidth - wallThickness / 2, halfHeight, 0]} receiveShadow castShadow>
            <boxGeometry args={[wallThickness, wallHeight, depth + wallThickness * 2]} />
            <meshStandardMaterial map={wallMap} color={wallColor} roughness={0.85} />
          </mesh>

          {/* Right Wall */}
          <mesh position={[halfWidth + wallThickness / 2, halfHeight, 0]} receiveShadow castShadow>
            <boxGeometry args={[wallThickness, wallHeight, depth + wallThickness * 2]} />
            <meshStandardMaterial map={wallMap} color={wallColor} roughness={0.85} />
          </mesh>

          {/* Front Wall (Optional) */}
          {showFrontWall && (
            <mesh position={[0, halfHeight, halfDepth + wallThickness / 2]} receiveShadow castShadow>
              <boxGeometry args={[width + wallThickness * 2, wallHeight, wallThickness]} />
              <meshStandardMaterial map={wallMap} color={wallColor} roughness={0.85} />
            </mesh>
          )}

          {/* --- BASEBOARDS (Skirting) --- */}
          {showBaseboards && (
            <group>
              {/* Back Baseboard */}
              <mesh position={[0, bbHeight / 2, -halfDepth + bbThickness / 2]} receiveShadow>
                <boxGeometry args={[width, bbHeight, bbThickness]} />
                <meshStandardMaterial color="#ffffff" roughness={0.5} />
              </mesh>
              
              {/* Left Baseboard */}
              <mesh position={[-halfWidth + bbThickness / 2, bbHeight / 2, 0]} receiveShadow>
                <boxGeometry args={[bbThickness, bbHeight, depth]} />
                <meshStandardMaterial color="#ffffff" roughness={0.5} />
              </mesh>

              {/* Right Baseboard */}
              <mesh position={[halfWidth - bbThickness / 2, bbHeight / 2, 0]} receiveShadow>
                <boxGeometry args={[bbThickness, bbHeight, depth]} />
                <meshStandardMaterial color="#ffffff" roughness={0.5} />
              </mesh>

              {/* Front Baseboard */}
              {showFrontWall && (
                <mesh position={[0, bbHeight / 2, halfDepth - bbThickness / 2]} receiveShadow>
                  <boxGeometry args={[width, bbHeight, bbThickness]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.5} />
                </mesh>
              )}
            </group>
          )}
        </group>
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