import React, { useRef, useEffect } from 'react';
import { TransformControls, Html, Outlines } from '@react-three/drei';

export default function Furniture({ 
  data, isSelected, onSelect, onChange, mode, setIsDragging 
}) {
  const { id, type, position, rotation, scale, color } = data;
  const meshRef = useRef();
  const controlsRef = useRef();

  // Define geometry based on type
  const getGeometry = () => {
    switch (type) {
      case 'Table': return <boxGeometry args={[1.5, 0.1, 1]} />;
      case 'Chair': return <cylinderGeometry args={[0.3, 0.3, 1, 16]} />;
      case 'Bed': return <boxGeometry args={[2, 0.5, 3]} />;
      case 'Cabinet': return <boxGeometry args={[1, 2, 0.8]} />;
      case 'Lamp': return <coneGeometry args={[0.3, 1, 32]} />;
      case 'Sofa': return <boxGeometry args={[2.5, 0.6, 1]} />;
      default: return <boxGeometry args={[0.5, 0.5, 0.5]} />;
    }
  };

  const isEditable = isSelected && mode !== 'Tour';

  return (
    <>
      {isEditable && (
        <TransformControls
          ref={controlsRef}
          object={meshRef}
          mode="translate" // Allows dragging on axes or planes
          
          // Disable camera orbit when dragging starts
          onMouseDown={() => {
            if (setIsDragging) setIsDragging(true);
          }}
          
          // Commit changes to state only when dragging ends (Optimization)
          onMouseUp={() => {
            if (setIsDragging) setIsDragging(false);
            
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
      >
        <mesh
          onClick={(e) => {
            e.stopPropagation();
            onSelect(id);
          }}
          castShadow
          receiveShadow
        >
          {getGeometry()}
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
          
          {/* Highlight Selection Outline */}
          {isSelected && <Outlines thickness={2} color="#3b82f6" />}
        </mesh>

        {/* Light source for Lamps */}
        {type === 'Lamp' && (
          <pointLight position={[0, 0.5, 0]} intensity={2} distance={8} color="#ffddaa" castShadow />
        )}

        {/* Label on hover or select */}
        {isSelected && (
          <Html position={[0, 1.5, 0]} center>
            <div style={{ 
              background: '#3b82f6', color: 'white', padding: '4px 8px', 
              borderRadius: '4px', fontSize: '12px', pointerEvents: 'none',
              whiteSpace: 'nowrap'
            }}>
              {type}
            </div>
          </Html>
        )}
      </group>
    </>
  );
}