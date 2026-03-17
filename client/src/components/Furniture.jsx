import React, { useRef, useMemo, useState, useEffect } from 'react';
import { TransformControls, Html, useGLTF, Edges } from '@react-three/drei';
import * as THREE from 'three';

export default function Furniture({ 
  data, 
  isSelected, 
  onSelect, 
  onChange, 
  mode, 
  setIsDragging, 
  roomConfig 
}) {
  const { id, type, position, rotation, scale, modelUrl } = data;
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // 1. Safe Model Loading
  const modelPath = modelUrl || `/models/${type.toLowerCase()}.glb`;
  const { scene } = useGLTF(modelPath);

  // 2. Clone & Prepare Scene (Shadows & Materials)
  const clone = useMemo(() => {
    if (!scene) return null;
    const clonedScene = scene.clone();
    
    clonedScene.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        if (node.material) {
           node.material = node.material.clone(); 
        }
      }
    });
    return clonedScene;
  }, [scene]);

  useEffect(() => {
    return () => {
      if (clone) {
        clone.traverse((node) => {
          if (node.isMesh && node.material) {
            node.material.dispose();
          }
        });
      }
    };
  }, [clone]);

  // 3. Transform & Proper Collision Logic
  const showTransform = isSelected && mode !== 'Tour';

  const handleTransformChange = () => {
    if (!meshRef.current) return;
    const mesh = meshRef.current;

    // A. Floor Lock (Keep it strictly on the ground)
    mesh.position.y = 0;

    // B. Real-time Bounding Box Collision
    // Ensure the matrix is fully updated for this frame before calculating bounds
    mesh.updateMatrixWorld();
    
    // Get the exact world-space bounding box of the model (accounts for rotation/scale)
    const box = new THREE.Box3().setFromObject(mesh);
    
    const roomWidth = roomConfig?.width || 15;
    const roomDepth = roomConfig?.depth || 15;

    // Room inner boundaries
    const roomMinX = -roomWidth / 2;
    const roomMaxX = roomWidth / 2;
    const roomMinZ = -roomDepth / 2;
    const roomMaxZ = roomDepth / 2;

    let newX = mesh.position.x;
    let newZ = mesh.position.z;

    // Calculate dimensions of the bounding box itself
    const boxWidth = box.max.x - box.min.x;
    const boxDepth = box.max.z - box.min.z;

    // Prevent clipping on the X Axis
    if (boxWidth > roomWidth) {
      newX = 0; // Fallback if object is larger than the room itself
    } else {
      if (box.min.x < roomMinX) newX += (roomMinX - box.min.x);
      if (box.max.x > roomMaxX) newX -= (box.max.x - roomMaxX);
    }

    // Prevent clipping on the Z Axis
    if (boxDepth > roomDepth) {
      newZ = 0; // Fallback if object is larger than the room itself
    } else {
      if (box.min.z < roomMinZ) newZ += (roomMinZ - box.min.z);
      if (box.max.z > roomMaxZ) newZ -= (box.max.z - roomMaxZ);
    }

    // Apply the corrected, collision-safe positions
    mesh.position.x = newX;
    mesh.position.z = newZ;
  };

  const handleTransformEnd = () => {
    if (setIsDragging) setIsDragging(false);
    
    if (meshRef.current) {
      onChange(id, {
        position: meshRef.current.position.toArray(),
        rotation: meshRef.current.rotation.toArray(),
        scale: typeof meshRef.current.scale.toArray === 'function' 
          ? meshRef.current.scale.toArray() 
          : [meshRef.current.scale.x, meshRef.current.scale.y, meshRef.current.scale.z],
      });
    }
  };

  // 4. Cursor Logic
  useEffect(() => {
    if (hovered && mode !== 'Tour') {
      document.body.style.cursor = 'grab';
    } else {
      document.body.style.cursor = 'auto';
    }
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered, mode]);

  const formattedScale = Array.isArray(scale) ? scale : [scale, scale, scale];

  return (
    <>
      {showTransform && (
        <TransformControls
          object={meshRef}
          mode="translate"
          showY={false}
          translationSnap={0.05}
          rotationSnap={Math.PI / 12}
          onMouseDown={() => setIsDragging && setIsDragging(true)}
          onObjectChange={handleTransformChange}
          onMouseUp={handleTransformEnd}
        />
      )}

      <group
        ref={meshRef}
        position={position}
        rotation={rotation}
        scale={formattedScale}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        dispose={null}
      >
        {clone && <primitive object={clone} />}

        {(isSelected || hovered) && (
          <Edges 
            scale={1.02} 
            threshold={15}
            color={isSelected ? "#4facfe" : "#a1a1aa"} 
            opacity={isSelected ? 1 : 0.6}
            transparent
          />
        )}

        {type === 'Lamp' && (
          <group position={[0, 1.5, 0]}>
            <pointLight intensity={2} distance={6} color="#ffeebb" castShadow shadow-bias={-0.001} />
            <mesh>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        )}

        {isSelected && (
          <Html position={[0, 2.2, 0]} center zIndexRange={[100, 0]}>
            <div style={{
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(4px)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '600',
              fontFamily: 'system-ui, sans-serif',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.1)',
              pointerEvents: 'none',
              transform: 'translate3d(0,0,0)',
              userSelect: 'none'
            }}>
              {type}
              <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px', fontWeight: '400' }}>
                X: {position[0].toFixed(1)}m | Z: {position[2].toFixed(1)}m
              </div>
            </div>
          </Html>
        )}
      </group>
    </>
  );
}