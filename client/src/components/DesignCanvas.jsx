import React, { useRef, useState, forwardRef, useImperativeHandle, Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { 
  OrbitControls, PointerLockControls, Sky, Environment,
  GizmoHelper, GizmoViewport, Grid, Html, ContactShadows,
  SoftShadows, PerformanceMonitor
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';

import Furniture from './Furniture';
import Room from './Room';
import TourControls from './TourControls';

// --- Configuration ---
const LIGHT_CONFIG = {
  Day: { 
    sun: [5, 5, 5], 
    intensity: 2, 
    ambient: 0.5, 
    file: '/textures/day.hdr', 
    bg: '#f0f5f5' 
  },
  Golden: { 
    sun: [10, 2, 5], 
    intensity: 1.5, 
    ambient: 0.6, 
    file: '/textures/sunset.hdr', 
    bg: '#ffecd1' 
  },
  Night: { 
    sun: [5, 5, -5], 
    intensity: 0.4, 
    ambient: 0.2, 
    file: '/textures/night.hdr', 
    bg: '#050510' 
  },
};

// --- Helper Components ---

const LoadingScreen = () => (
  <Html center>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <div className="spinner" style={{
        width: '40px', height: '40px', border: '4px solid #f3f3f3',
        borderTop: '4px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite'
      }} />
      <span style={{ fontFamily: 'sans-serif', color: '#666', fontSize: '12px' }}>Loading Assets...</span>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  </Html>
);

/**
 * CameraController
 * Enforces strict camera behavior per mode.
 */
const CameraController = ({ mode }) => {
  const { camera, controls } = useThree();

  useEffect(() => {
    if (!controls?.current) return;
    const ctrl = controls.current;

    // Reset internal state to avoid drifting from previous modes
    ctrl.reset();

    if (mode === '2D') {
      // --- BLUEPRINT MODE (Strict Top-Down) ---
      
      // 1. Move camera high up, looking straight down
      camera.position.set(0, 50, 0); 
      camera.lookAt(0, 0, 0);
      
      // 2. Center the pivot point
      ctrl.target.set(0, 0, 0);

      // 3. LOCK Rotation
      ctrl.enableRotate = false; 
      
      // 4. Enable Panning (moves map X/Z)
      ctrl.screenSpacePanning = true; 
      ctrl.enableZoom = true;

      // 5. Hard constraints on angles (0 = Top down)
      ctrl.minPolarAngle = 0;
      ctrl.maxPolarAngle = 0;
      
      // 6. Zoom constraints
      ctrl.minDistance = 10;
      ctrl.maxDistance = 150;

    } else if (mode === '3D') {
      // --- 3D VIEW (Isometric-ish) ---
      
      // 1. Set Isometric angle
      camera.position.set(12, 20, 12);
      camera.lookAt(0, 0, 0);
      ctrl.target.set(0, 0, 0);

      // 2. Enable Rotation
      ctrl.enableRotate = true;
      ctrl.screenSpacePanning = false; // Standard 3D orbit
      
      // 3. Allow looking around, but stop at floor
      ctrl.minPolarAngle = 0;
      ctrl.maxPolarAngle = Math.PI / 2.1; 
      
      ctrl.minDistance = 2;
      ctrl.maxDistance = 50;
    }
    
    // Tour mode is handled by PointerLockControls
    
    ctrl.update();
  }, [mode, camera, controls]);

  return null;
};

// --- Main Canvas ---

const DesignCanvas = forwardRef(({ 
   items, selectedId, setSelectedId, updateItem, deleteItem, 
   mode, roomConfig, onTourUnlock 
}, ref) => {
  const canvasRef = useRef();
  const [dpr, setDpr] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  useImperativeHandle(ref, () => ({
    takeScreenshot: () => {
      if (canvasRef.current) {
        return canvasRef.current.toDataURL('image/jpeg', 0.95);
      }
    }
  }));

  const config = LIGHT_CONFIG[roomConfig.lightingMode] || LIGHT_CONFIG.Day;
  const is2D = mode === '2D';
  const isTour = mode === 'Tour';

  return (
    <Canvas
      ref={canvasRef}
      shadows="soft"
      dpr={dpr}
      // UPDATE: Bound FOV to the roomConfig state
      camera={{ position: [10, 10, 10], fov: roomConfig.cameraFov || 50 }}
      gl={{ 
        preserveDrawingBuffer: true,
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.9
      }}
      onPointerMissed={(e) => {
        if (!isDragging && e.type === 'click') setSelectedId(null);
      }}
    >
      <PerformanceMonitor 
        onIncline={() => setDpr(2)} 
        onDecline={() => setDpr(1)} 
        flipflops={3} 
      />

      <color attach="background" args={[config.bg]} />

      {/* --- LIGHTING --- */}
      <ambientLight intensity={config.ambient} />
      <directionalLight 
        position={config.sun} 
        intensity={config.intensity} 
        castShadow 
        shadow-bias={-0.0005}
        shadow-mapSize={[1024, 1024]}
      >
        <orthographicCamera attach="shadow-camera" args={[-20, 20, 20, -20]} />
      </directionalLight>

      {/* UPDATE: Conditional Soft Shadows based on toggle */}
      {!is2D && roomConfig.shadowsEnabled !== false && (
        <SoftShadows size={10} samples={12} focus={0.5} />
      )}

      <Environment 
        files={config.file} 
        background={false} 
        blur={0.5} 
      />

      {roomConfig.lightingMode !== 'Night' && (
        <Sky sunPosition={config.sun} turbidity={8} rayleigh={6} />
      )}

      {/* --- SCENE CONTENT --- */}
      <group position={[0, -0.01, 0]}>
        <Room 
          width={roomConfig.width} 
          depth={roomConfig.depth} 
          wallColor={roomConfig.wallColor} 
          floorColor={roomConfig.floorColor} 
        />
        
        {/* UPDATE: Conditional Blueprint Grid based on toggle */}
        {is2D && roomConfig.showGrid !== false && (
           <Grid 
             args={[100, 100]} 
             sectionSize={2} 
             sectionColor="#333333" // Dark technical lines
             cellColor="#999999"    // Softer sub-lines
             position={[0, 0.05, 0]} // Slightly above floor to prevent z-fighting
             infiniteGrid 
             fadeDistance={200} 
             opacity={0.8}
           />
        )}

        {/* Shadows (Only in 3D/Tour) */}
        {!is2D && (
           <ContactShadows 
             resolution={1024} 
             scale={roomConfig.width * 2} 
             blur={2} 
             opacity={0.4} 
             far={1} 
             color="#000000" 
           />
        )}
      </group>

      <Suspense fallback={<LoadingScreen />}>
        <group>
          {items.map((item) => (
            <Furniture
              key={item.id}
              data={item}
              isSelected={selectedId === item.id}
              onSelect={setSelectedId}
              onChange={updateItem}
              mode={mode}
              setIsDragging={setIsDragging}
              roomConfig={roomConfig}
            />
          ))}
        </group>
      </Suspense>

      {/* Post Processing (Only in 3D/Tour) */}
      {!is2D && (
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={1.5} mipmapBlur intensity={0.4} radius={0.6} />
          <Vignette eskil={false} offset={0.1} darkness={0.5} />
          <Noise opacity={0.02} />
        </EffectComposer>
      )}

      {/* --- CONTROLS LOGIC --- */}
      <CameraController mode={mode} />

      {isTour ? (
        <>
          <PointerLockControls selector="#tour-overlay" onUnlock={onTourUnlock} />
          <TourControls active={true} />
        </>
      ) : (
        <>
          <OrbitControls 
            makeDefault 
            enabled={!isDragging}
            enableDamping 
            dampingFactor={0.1}
            // Constraints are dynamically set by CameraController
          />
          {/* Gizmo only for 3D View */}
          {!is2D && (
            <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
              <GizmoViewport labelColor="white" axisHeadScale={1} />
            </GizmoHelper>
          )}
        </>
      )}
    </Canvas>
  );
});

export default DesignCanvas;