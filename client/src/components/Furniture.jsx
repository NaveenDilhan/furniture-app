import React, { useRef, useMemo } from 'react';
import { TransformControls, Html, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export default function Furniture({ 
  data, isSelected, onSelect, onChange, mode, setIsDragging, roomConfig 
}) {
  const { id, type, position, rotation, scale } = data;
  const meshRef = useRef();
  
  // 1. Load the model
  const modelPath = `/models/${type.toLowerCase()}.glb`;
  const { scene } = useGLTF(modelPath, true); 

  // 2. Clone scene for multiple instances
  const clone = useMemo(() => scene.clone(), [scene]);

    // 3. Tag all meshes in this furniture with the furniture ID for raycasting
  // Using useMemo on clone to tag immediately when clone is created
  useMemo(() => {
    clone.userData.furnitureId = id;
    clone.userData.furnitureType = type;
    clone.traverse((child) => {
      child.userData.furnitureId = id;
      child.userData.furnitureType = type;
    });
  }, [clone, id, type]);

  const isEditable = isSelected && mode !== 'Tour';

  // --- BOUNDARY LIMITS ---
  const widthLimit = (roomConfig?.width || 15) / 2 - 0.5;
  const depthLimit = (roomConfig?.depth || 15) / 2 - 0.5;

  return (
    <>
      {isEditable && (
        <TransformControls
          object={meshRef}
          mode="translate"
          showY={false} 
          
          onMouseDown={() => setIsDragging && setIsDragging(true)}
          
          onObjectChange={() => {
             if (meshRef.current) {
                const pos = meshRef.current.position;
                pos.y = 0; 
                pos.x = THREE.MathUtils.clamp(pos.x, -widthLimit, widthLimit);
                pos.z = THREE.MathUtils.clamp(pos.z, -depthLimit, depthLimit);
             }
          }}

          onMouseUp={() => {
            setIsDragging && setIsDragging(false);
            if (meshRef.current) {
              onChange(id, {
                position: meshRef.current.position.toArray(),
                rotation: meshRef.current.rotation.toArray(),
                scale: meshRef.current.scale.toArray(),
              });
            }
          }}
        />
      )}

      <group 
        ref={meshRef}
        position={position} 
        rotation={rotation} 
        scale={scale} 
        onClick={(e) => {
          e.stopPropagation();
          onSelect(id);
        }}
      >
        <primitive object={clone} castShadow receiveShadow />

        {/* Selection Box */}
        {isSelected && (
          <mesh visible={false}>
            <boxGeometry args={[1, 1, 1]} /> 
          </mesh>
        )}

        {/* Lamp Light */}
        {type === 'Lamp' && (
          <pointLight position={[0, 1.5, 0]} intensity={3} distance={5} color="#ffddaa" castShadow />
        )}

        {/* Label */}
        {isSelected && (
          <Html position={[0, 2, 0]} center>
            <div style={{ 
              background: '#3b82f6', color: 'white', padding: '4px 8px', 
              borderRadius: '4px', fontSize: '12px', pointerEvents: 'none',
              whiteSpace: 'nowrap', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              {type}
            </div>
          </Html>
        )}
      </group>
    </>
  );
}
