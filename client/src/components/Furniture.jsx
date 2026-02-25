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
  const { id, type, position, rotation, scale } = data;
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // 1. Safe Model Loading
  const modelPath = `/models/${type.toLowerCase()}.glb`;
  const { scene } = useGLTF(modelPath);

  // 2. Clone & Prepare Scene (Shadows & Materials)
  const clone = useMemo(() => {
    const clonedScene = scene.clone();
    
    // Traverse the model to ensure all child meshes handle shadows
    clonedScene.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        
        // Optional: Dispose of old materials if strictly managing memory
        // but crucial for independent instances
        if (node.material) {
           node.material = node.material.clone(); 
        }
      }
    });
    return clonedScene;
  }, [scene]);

  // 3. Boundary Calculations
  const widthLimit = (roomConfig?.width || 15) / 2 - 0.5; // 0.5m buffer
  const depthLimit = (roomConfig?.depth || 15) / 2 - 0.5;

  // 4. Transform Logic
  // Only allow transform if selected AND not in "Tour" mode
  const showTransform = isSelected && mode !== 'Tour';

  const handleTransformChange = () => {
    if (!meshRef.current) return;

    const currentPos = meshRef.current.position;

    // A. Floor Lock
    if (currentPos.y !== 0) currentPos.y = 0;

    // B. Wall Clamp
    currentPos.x = THREE.MathUtils.clamp(currentPos.x, -widthLimit, widthLimit);
    currentPos.z = THREE.MathUtils.clamp(currentPos.z, -depthLimit, depthLimit);
  };

  const handleTransformEnd = () => {
    if (setIsDragging) setIsDragging(false);
    
    if (meshRef.current) {
      onChange(id, {
        position: meshRef.current.position.toArray(),
        rotation: meshRef.current.rotation.toArray(),
        scale: meshRef.current.scale.toArray(),
      });
    }
  };

  // 5. Cursor Logic
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered]);

  return (
    <>
      {showTransform && (
        <TransformControls
          object={meshRef}
          mode="translate" // You can pass 'rotate' here if you add a toggle in UI
          showY={false} // Disable vertical movement arrow
          translationSnap={0.1} // Snaps to 10cm grid for cleaner layout
          rotationSnap={Math.PI / 12} // Snaps rotation to 15 degrees
          
          onMouseDown={() => setIsDragging && setIsDragging(true)}
          onObjectChange={handleTransformChange}
          onMouseUp={handleTransformEnd}
        />
      )}

      <group
        ref={meshRef}
        position={position}
        rotation={rotation}
        scale={scale}
        onClick={(e) => {
          e.stopPropagation(); // Prevent clicking floor when clicking item
          onSelect(id);
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <primitive object={clone} />

        {/* Visual Feedback: Selection Outline */}
        {/* Only shows when selected or hovered */}
        {(isSelected || hovered) && (
          <Edges 
            scale={1.05} // Slightly larger than object
            threshold={15} // Angle threshold
            color={isSelected ? "#4facfe" : "#ffffff"} 
            opacity={isSelected ? 1 : 0.3}
            transparent
          />
        )}

        {/* Dynamic Light for Lamps */}
        {type === 'Lamp' && (
          <group position={[0, 1.5, 0]}>
            <pointLight intensity={2} distance={6} color="#ffeebb" castShadow shadow-bias={-0.001} />
            {/* Small visible bulb helper */}
            <mesh>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshBasicMaterial color="#ffeebb" />
            </mesh>
          </group>
        )}

        {/* UI Label */}
        {isSelected && (
          <Html position={[0, 1.8, 0]} center zIndexRange={[100, 0]}>
            <div style={{
              background: 'rgba(15, 23, 42, 0.9)',
              color: 'white',
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '500',
              fontFamily: 'sans-serif',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.2)',
              pointerEvents: 'none',
              transform: 'translate3d(0,0,0)' // Hardware acceleration
            }}>
              {type}
              <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '2px' }}>
                x: {position[0].toFixed(1)} | z: {position[2].toFixed(1)}
              </div>
            </div>
          </Html>
        )}
      </group>
    </>
  );
}

// Optimization: Preload standard models to prevent "pop-in"
// You can expand this list based on your available assets
useGLTF.preload('/models/chair.glb');
useGLTF.preload('/models/table.glb');
useGLTF.preload('/models/lamp.glb');