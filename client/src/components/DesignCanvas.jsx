import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import Furniture from './Furniture';

export default function DesignCanvas({ items, selectedId, setSelectedId, updateItem, mode }) {
  const controlsRef = useRef();

  // Effect: When mode changes to 2D, force the camera to look top-down
  useEffect(() => {
    if (controlsRef.current) {
      if (mode === '2D') {
        // Reset camera for top-down view
        controlsRef.current.object.position.set(0, 10, 0); // Move camera up
        controlsRef.current.object.lookAt(0, 0, 0);        // Look at center
        controlsRef.current.update();
      } else {
        // Reset camera for 3D view
        controlsRef.current.object.position.set(5, 5, 5);
        controlsRef.current.update();
      }
    }
  }, [mode]);

  return (
    <div style={{ flex: 1, position: 'relative', background: '#202020' }}>
      <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }}>
        
        {/* Environment */}
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
        <Grid infiniteGrid fadeDistance={50} sectionColor="#444" cellColor="#666" />

        {/* Render All Furniture Items */}
        {items.map((item) => (
          <Furniture
            key={item.id}
            data={item}
            isSelected={selectedId === item.id}
            onSelect={setSelectedId}
            onChange={updateItem}
          />
        ))}

        {/* --- FIX: SINGLE ORBIT CONTROLS --- */}
        <OrbitControls 
          ref={controlsRef}
          makeDefault 
          // If 2D, disable rotation. If 3D, enable it.
          enableRotate={mode === '3D'}
          // If 2D, lock angle to top (0). If 3D, allow full rotation (PI).
          maxPolarAngle={mode === '2D' ? 0 : Math.PI}
          minPolarAngle={0} 
        />
      </Canvas>
    </div>
  );
}