import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { Grid } from '@react-three/drei';

// Constants for texture scaling
const TEXTURE_SCALE_FLOOR = 4.0;
const TEXTURE_SCALE_WALL = 3.0;

// Helper: Generates 2D wall points based on shape type
const getFloorPlan = (shape, w, d) => {
  const hw = w / 2; 
  const hd = d / 2;
  switch (shape) {
    case 'L-Shape':
      return [[-hw, -hd], [hw, -hd], [hw, 0], [0, 0], [0, hd], [-hw, hd]];
    case 'T-Shape':
      return [[-hw, -hd], [hw, -hd], [hw, -hd/2], [w/4, -hd/2], [w/4, hd], [-w/4, hd], [-w/4, -hd/2], [-hw, -hd/2]];
    case 'U-Shape':
      return [[-hw, -hd], [hw, -hd], [hw, hd], [w/4, hd], [w/4, 0], [-w/4, 0], [-w/4, hd], [-hw, hd]];
    default: // Rectangular
      return [[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]];
  }
};

// Component for a dynamic, single wall segment
function Wall({ p1, p2, height, thickness, windows, texture, color, showBaseboards, isFrontFacing, showFrontWall }) {
  if (!showFrontWall && isFrontFacing) return null;

  const length = new THREE.Vector2(p1[0], p1[1]).distanceTo(new THREE.Vector2(p2[0], p2[1]));
  const angle = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);

  const geom = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(length, 0);
    shape.lineTo(length, height);
    shape.lineTo(0, height);
    shape.closePath(); 

    // Carve windows
    if (windows && windows.length > 0) {
      windows.forEach(win => {
        const hole = new THREE.Path();
        const wx = Math.max(0.1, Math.min(win.x, length - win.width - 0.1));
        const wy = Math.max(0.1, Math.min(win.y, height - win.height - 0.1));
        
        hole.moveTo(wx, wy);
        hole.lineTo(wx, wy + win.height);
        hole.lineTo(wx + win.width, wy + win.height);
        hole.lineTo(wx + win.width, wy);
        hole.closePath();
        
        shape.holes.push(hole);
      });
    }

    const extrudeGeom = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false });

    const pos = extrudeGeom.attributes.position;
    const uvs = new Float32Array(pos.count * 2);
    for (let i = 0; i < pos.count; i++) {
        uvs[i * 2] = pos.getX(i) / TEXTURE_SCALE_WALL;
        uvs[i * 2 + 1] = pos.getY(i) / TEXTURE_SCALE_WALL;
    }
    extrudeGeom.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    
    return extrudeGeom;
  }, [length, height, thickness, windows]);

  const bbGeom = useMemo(() => {
    if (!showBaseboards) return null;
    const bbShape = new THREE.Shape();
    bbShape.moveTo(0, 0);
    bbShape.lineTo(length, 0);
    bbShape.lineTo(length, 0.15);
    bbShape.lineTo(0, 0.15);
    bbShape.closePath();
    return new THREE.ExtrudeGeometry(bbShape, { depth: thickness + 0.02, bevelEnabled: false });
  }, [length, thickness, showBaseboards]);

  return (
    <group position={[p1[0], 0, p1[1]]} rotation={[0, -angle, 0]}>
      <mesh castShadow receiveShadow geometry={geom}>
        <meshStandardMaterial map={texture} color={color} roughness={0.85} />
      </mesh>
      {showBaseboards && bbGeom && (
         <mesh receiveShadow geometry={bbGeom} position={[0, 0, -0.01]}>
           <meshStandardMaterial color="#ffffff" roughness={0.5} />
         </mesh>
      )}
    </group>
  );
}

export default function Room({
  roomConfig,
  setRoomConfig,
  is2D
}) {
  const {
    width = 15, depth = 15, wallHeight = 5, shape = 'Rectangular', 
    windows = [], wallColor = '#ffffff', wallTexture, floorTexture, 
    showFrontWall = false, showCeiling = false, showBaseboards = true,
    editFloorMode = false, deletedTiles = []
  } = roomConfig;

  const [floorMap, wallMap] = useLoader(THREE.TextureLoader, [
    floorTexture || '/textures/wood_floor.jpg',
    wallTexture || '/textures/wall_paint.jpg',
  ]);

  useMemo(() => {
    floorMap.wrapS = floorMap.wrapT = THREE.RepeatWrapping;
    floorMap.repeat.set(1, 1); 
    floorMap.anisotropy = 16;
    floorMap.colorSpace = THREE.SRGBColorSpace;

    wallMap.wrapS = wallMap.wrapT = THREE.RepeatWrapping;
    wallMap.repeat.set(1, 1); 
    wallMap.anisotropy = 16;
    wallMap.colorSpace = THREE.SRGBColorSpace;
  }, [floorMap, wallMap]);

  const wallThickness = 0.2;
  const wallPoints = useMemo(() => getFloorPlan(shape, width, depth), [shape, width, depth]);

  // Master Floor Generator with Custom User Holes
  const floorGeom = useMemo(() => {
    const hw = width / 2;
    const hd = depth / 2;
    
    // 1. Base is ALWAYS a perfect rectangle bounding box (CCW)
    const floorShape = new THREE.Shape();
    floorShape.moveTo(-hw, -hd);
    floorShape.lineTo(hw, -hd);
    floorShape.lineTo(hw, hd);
    floorShape.lineTo(-hw, hd);
    floorShape.closePath();

    // 2. Subtract user-deleted tiles perfectly (CW holes)
    deletedTiles.forEach(tileId => {
      const [tx, tz] = tileId.split('_').map(Number);
      
      // FIX: The 3D rotation of -90deg on X flips the Y axis into the -Z axis.
      // Therefore, we MUST invert the Z coordinate to place the hole accurately.
      const localX = tx;
      const localY = -tz;

      const hole = new THREE.Path();
      hole.moveTo(localX - 0.5, localY - 0.5);
      hole.lineTo(localX - 0.5, localY + 0.5);
      hole.lineTo(localX + 0.5, localY + 0.5);
      hole.lineTo(localX + 0.5, localY - 0.5);
      hole.closePath();
      floorShape.holes.push(hole);
    });

    const geom = new THREE.ExtrudeGeometry(floorShape, { depth: 0.1, bevelEnabled: false });

    // Absolute UV Mapping keeps textures locked perfectly even when punching holes
    const pos = geom.attributes.position;
    const uvs = new Float32Array(pos.count * 2);
    for (let i = 0; i < pos.count; i++) {
        uvs[i * 2] = pos.getX(i) / TEXTURE_SCALE_FLOOR;
        uvs[i * 2 + 1] = pos.getY(i) / TEXTURE_SCALE_FLOOR;
    }
    
    geom.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geom.computeVertexNormals(); 
    
    return geom;
  }, [width, depth, deletedTiles]);

  // Handle clicking to delete/restore tiles
  const handleFloorClick = (e) => {
    if (!editFloorMode || !setRoomConfig) return;
    e.stopPropagation(); // Prevent clicking on objects below the floor
    
    // e.point is ALWAYS the absolute world coordinate intersection
    const cx = Math.floor(e.point.x) + 0.5;
    const cz = Math.floor(e.point.z) + 0.5;
    const id = `${cx}_${cz}`;

    setRoomConfig(prev => {
      const tiles = prev.deletedTiles || [];
      if (tiles.includes(id)) {
        return { ...prev, deletedTiles: tiles.filter(t => t !== id) }; // Restore tile
      } else {
        return { ...prev, deletedTiles: [...tiles, id] }; // Delete tile
      }
    });
  };

  return (
    <group>
      {/* --- INTERACTIVE FLOOR EDITOR --- */}
      {editFloorMode && (
        <group position={[0, 0.01, 0]}>
           {/* Visual Green Grid to show editable cells */}
           <Grid 
             args={[width, depth]} 
             sectionSize={1} 
             cellColor="#10b981" 
             sectionColor="#10b981" 
             fadeDistance={50} 
             opacity={0.6}
           />
           {/* Invisible Plane to catch clicks on empty/deleted spaces so you can restore them */}
           <mesh rotation={[-Math.PI / 2, 0, 0]} onClick={handleFloorClick}>
             <planeGeometry args={[width, depth]} />
             <meshBasicMaterial visible={false} side={THREE.DoubleSide} />
           </mesh>
        </group>
      )}

      {/* --- FLOOR MESH --- */}
      {/* If edit mode is active, the floor mesh also catches clicks to delete existing tiles */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow geometry={floorGeom} onClick={editFloorMode ? handleFloorClick : undefined}>
        <meshStandardMaterial 
          map={floorMap} 
          roughness={0.4}
          metalness={0.05}
        />
      </mesh>

      {/* --- CEILING --- */}
      {!is2D && showCeiling && (
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, wallHeight, 0]} receiveShadow geometry={floorGeom}>
          <meshStandardMaterial color="#fafafa" roughness={0.9} />
        </mesh>
      )}

      {/* --- WALLS --- */}
      {!is2D && wallPoints.map((p1, i) => {
        const p2 = wallPoints[(i + 1) % wallPoints.length];
        const isFrontFacing = p2[0] < p1[0]; 
        const wallWindows = windows.filter(w => w.wallIndex === i);

        return (
          <Wall
            key={`wall-${i}`}
            p1={p1}
            p2={p2}
            height={wallHeight}
            thickness={wallThickness}
            windows={wallWindows}
            texture={wallMap}
            color={wallColor}
            showBaseboards={showBaseboards}
            isFrontFacing={isFrontFacing}
            showFrontWall={showFrontWall}
          />
        );
      })}
    </group>
  );
}

useLoader.preload(THREE.TextureLoader, '/textures/wood_floor.jpg');
useLoader.preload(THREE.TextureLoader, '/textures/tile_floor.jpg');
useLoader.preload(THREE.TextureLoader, '/textures/marble_floor.jpg');
useLoader.preload(THREE.TextureLoader, '/textures/concrete_floor.jpg');
useLoader.preload(THREE.TextureLoader, '/textures/wall_paint.jpg');
useLoader.preload(THREE.TextureLoader, '/textures/brick_wall.jpg');
useLoader.preload(THREE.TextureLoader, '/textures/concrete_wall.jpg');
useLoader.preload(THREE.TextureLoader, '/textures/wallpaper_wall.jpg');
useLoader.preload(THREE.TextureLoader, '/textures/wood_panel_wall.jpg');