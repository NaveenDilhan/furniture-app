import React, { useRef, useMemo } from 'react';
import { TransformControls, Html, useGLTF } from '@react-three/drei';

export default function Furniture({ 
  data, isSelected, onSelect, onChange, mode, setIsDragging 
}) {
  const { id, type, position, rotation, scale } = data;
  const meshRef = useRef();
  
  // 1. Load the model based on type
  // Make sure these files exist in your public/models/ folder!
  const modelPath = `/models/${type.toLowerCase()}.glb`;
  const { scene } = useGLTF(modelPath, true); // true = useDraco if needed

  // 2. Clone the scene so we can have multiple instances of the same furniture
  const clone = useMemo(() => scene.clone(), [scene]);

  const isEditable = isSelected && mode !== 'Tour';

  return (
    <>
      {isEditable && (
        <TransformControls
          object={meshRef}
          mode="translate"
          onMouseDown={() => setIsDragging && setIsDragging(true)}
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
        {/* Render the actual 3D Model */}
        <primitive object={clone} castShadow receiveShadow />

        {/* Selection Box (Outline equivalent for complex models) */}
        {isSelected && (
          <mesh visible={false}>
            <boxGeometry args={[1, 1, 1]} /> {/* Hitbox proxy if needed */}
            {/* Visual indicator handled by TransformControls, or you can add a BoxHelper here */}
          </mesh>
        )}

        {/* Light source attached to Lamps */}
        {type === 'Lamp' && (
          <pointLight position={[0, 1.5, 0]} intensity={3} distance={5} color="#ffddaa" castShadow />
        )}

        {/* Floating Label */}
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