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

  // 1. Safe Model Loading: Use DB modelUrl, fallback to local path if missing
  const modelPath = modelUrl || `/models/${type.toLowerCase()}.glb`;
  
  // useGLTF handles caching automatically. 
  // NOTE: Ensure your <Canvas> is wrapped in a <Suspense> boundary.
  const { scene } = useGLTF(modelPath);

  // 2. Clone & Prepare Scene (Shadows & Materials)
  const clone = useMemo(() => {
    if (!scene) return null;
    const clonedScene = scene.clone();
    
    // Traverse the model to ensure all child meshes handle shadows
    clonedScene.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        
        // Clone materials to allow independent color changes per instance
        if (node.material) {
           node.material = node.material.clone(); 
        }
      }
    });
    return clonedScene;
  }, [scene]);

  // Cleanup cloned materials on unmount to prevent memory leaks
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

  // 3. Boundary Calculations
  // Ensure limits are positive numbers to prevent clamp errors
  const widthLimit = Math.max(0, (roomConfig?.width || 15) / 2 - 0.5); 
  const depthLimit = Math.max(0, (roomConfig?.depth || 15) / 2 - 0.5);

  // 4. Transform Logic
  const showTransform = isSelected && mode !== 'Tour';

  const handleTransformChange = () => {
    if (!meshRef.current) return;
    const currentPos = meshRef.current.position;

    // A. Floor Lock (Keep it strictly on the ground)
    if (currentPos.y !== 0) currentPos.y = 0;

    // B. Wall Clamp (Prevent dragging outside the room bounds)
    currentPos.x = THREE.MathUtils.clamp(currentPos.x, -widthLimit, widthLimit);
    currentPos.z = THREE.MathUtils.clamp(currentPos.z, -depthLimit, depthLimit);
  };

  const handleTransformEnd = () => {
    if (setIsDragging) setIsDragging(false);
    
    if (meshRef.current) {
      onChange(id, {
        position: meshRef.current.position.toArray(),
        rotation: meshRef.current.rotation.toArray(),
        // Check if scale is an array or a single number before saving
        scale: typeof meshRef.current.scale.toArray === 'function' 
          ? meshRef.current.scale.toArray() 
          : [meshRef.current.scale.x, meshRef.current.scale.y, meshRef.current.scale.z],
      });
    }
  };

  // 5. Cursor Logic
  useEffect(() => {
    if (hovered && mode !== 'Tour') {
      document.body.style.cursor = 'grab';
    } else {
      document.body.style.cursor = 'auto';
    }
    // Cleanup cursor on unmount
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered, mode]);

  // Ensure scale is formatted correctly for R3F (Array or Vector3)
  const formattedScale = Array.isArray(scale) ? scale : [scale, scale, scale];

  return (
    <>
      {showTransform && (
        <TransformControls
          object={meshRef}
          mode="translate"
          showY={false}
          translationSnap={0.1}
          rotationSnap={Math.PI / 12} // 15 degrees
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
          e.stopPropagation(); // Prevent hover events firing on items behind this one
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        dispose={null} // Let React manage disposal
      >
        {clone && <primitive object={clone} />}

        {/* Visual Feedback: Selection Outline */}
        {(isSelected || hovered) && (
          <Edges 
            scale={1.02} // Slightly tighter outline
            threshold={15}
            color={isSelected ? "#4facfe" : "#a1a1aa"} 
            opacity={isSelected ? 1 : 0.6}
            transparent
          />
        )}

        {/* Dynamic Light for Lamps */}
        {type === 'Lamp' && (
          <group position={[0, 1.5, 0]}>
            <pointLight 
              intensity={2} 
              distance={6} 
              color="#ffeebb" 
              castShadow 
              shadow-bias={-0.001} 
            />
            {/* Small visible bulb helper */}
            <mesh>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        )}

        {/* UI Label (Only visible when selected) */}
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