import React from 'react';
import { Html } from '@react-three/drei';

export default function WallOpening({
  data,
  isSelected,
  onSelect,
  roomConfig
}) {
  const {
    id,
    type,
    position,
    rotation,
    openingType,
    openingWidth = 1.2,
    openingHeight = 2,
    sillHeight = 0,
  } = data;

  const isDoor = openingType === 'door';
  const color = isDoor ? '#8b5a2b' : '#87ceeb';

  return (
    <group
      position={position}
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
    >
      {/* Main opening placeholder */}
      <mesh position={[0, sillHeight + openingHeight / 2, 0]}>
        <boxGeometry args={[openingWidth, openingHeight, 0.08]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Frame */}
      <mesh position={[0, sillHeight + openingHeight / 2, -0.03]}>
        <boxGeometry args={[openingWidth + 0.12, openingHeight + 0.12, 0.03]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>

      {/* Door handle */}
      {isDoor && (
        <mesh position={[openingWidth / 2 - 0.12, 1, 0.06]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#d4af37" />
        </mesh>
      )}

      {/* Window center divider */}
      {!isDoor && (
        <>
          <mesh position={[0, sillHeight + openingHeight / 2, 0.05]}>
            <boxGeometry args={[0.04, openingHeight, 0.02]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, sillHeight + openingHeight / 2, 0.05]} rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.04, openingWidth, 0.02]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </>
      )}

      {/* Selection outline effect */}
      {isSelected && (
        <mesh position={[0, sillHeight + openingHeight / 2, 0.09]}>
          <boxGeometry args={[openingWidth + 0.18, openingHeight + 0.18, 0.02]} />
          <meshBasicMaterial color="#4facfe" wireframe />
        </mesh>
      )}

      {/* Label */}
      {isSelected && (
        <Html position={[0, sillHeight + openingHeight + 0.4, 0]} center>
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.85)',
              color: 'white',
              padding: '6px 10px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              border: '1px solid rgba(255,255,255,0.1)',
              pointerEvents: 'none',
            }}
          >
            {type}
          </div>
        </Html>
      )}
    </group>
  );
}