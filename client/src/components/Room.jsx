import React from 'react';
import { Grid } from '@react-three/drei';

export default function Room({ width, depth, wallColor, floorColor }) {
  // Floor is centered at (0,0,0)
  // Walls are positioned based on width/depth
  
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={floorColor} />
      </mesh>
      
      {/* Grid Helper (Optional, overlays on floor) */}
      <Grid args={[width, depth]} sectionColor="#444" cellColor="#666" position={[0, 0.01, 0]} infiniteGrid={false} />

      {/* Back Wall */}
      <mesh position={[0, 2.5, -depth / 2]} receiveShadow>
        <boxGeometry args={[width, 5, 0.2]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-width / 2, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[depth, 5, 0.2]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[width / 2, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[depth, 5, 0.2]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
    </group>
  );
}