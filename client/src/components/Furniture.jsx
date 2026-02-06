import React from 'react';
import { TransformControls } from '@react-three/drei';

export default function Furniture({ data, isSelected, onSelect, onChange }) {
  const { id, type, position, rotation, scale, color } = data;

  const getGeometry = () => {
    if (type === 'Table') return <boxGeometry args={[1.5, 0.1, 1]} />;
    if (type === 'Chair') return <cylinderGeometry args={[0.3, 0.3, 1, 16]} />;
    return <boxGeometry args={[0.5, 0.5, 0.5]} />;
  };

  return (
    <>
      {isSelected && (
        <TransformControls
          position={position}
          rotation={rotation}
          scale={scale}
          mode="scale"
          onObjectChange={(e) => {
            onChange(id, {
              position: e.target.object.position.toArray(),
              scale: e.target.object.scale.toArray(),
              rotation: e.target.object.rotation.toArray(),
            });
          }}
        />
      )}

      <mesh
        position={position}
        rotation={rotation}
        scale={scale}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(id);
        }}
        castShadow
        receiveShadow
      >
        {getGeometry()}
        <meshStandardMaterial color={color} />
      </mesh>
    </>
  );
}