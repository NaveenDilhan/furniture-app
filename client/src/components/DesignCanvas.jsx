import React, { useRef, useState, forwardRef, useImperativeHandle, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, PointerLockControls, Sky, 
  GizmoHelper, GizmoViewport, Grid, Html, ContactShadows,
  PerformanceMonitor
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

import Furniture from './Furniture';
import Room from './Room';
import TourControls from './TourControls';

const LIGHT_CONFIG = {
  Day: { sun: [10, 20, 10], intensity: 1.5, bg: '#f0f0f0', ambient: 0.5 },
  Golden: { sun: [5, 2, 10], intensity: 1.2, bg: '#ffccaa', ambient: 0.6 },
  Night: { sun: [0, -5, 0], intensity: 0.2, bg: '#101010', ambient: 0.1 },
};

// --- Camera Controller ---
const CameraController = ({ mode }) => {
  const { controls } = useThree();
  const vec = new THREE.Vector3();

  useFrame((state, delta) => {
    if (!controls?.current) return;
    const step = 4 * delta;
    if (mode === '2D') {
      state.camera.position.lerp(vec.set(0, 30, 0.1), step);
      controls.current.target.lerp(vec.set(0, 0, 0), step);
    } 
    controls.current.update();
  });
  return null;
};

const DesignCanvas = forwardRef(({ 
   items, selectedId, setSelectedId, updateItem, mode, roomConfig, onTourUnlock, onScreenshot  
}, ref) => {
  const canvasRef = useRef();
  const [dpr, setDpr] = useState(1.5);
  const [isDragging, setIsDragging] = useState(false);

  useImperativeHandle(ref, () => ({
    takeScreenshot: () => canvasRef.current.toDataURL('image/jpeg', 0.9)
  }));

  const lighting = LIGHT_CONFIG[roomConfig.lightingMode] || LIGHT_CONFIG.Day;
  const is2D = mode === '2D';

  return (
    <Canvas
      shadows
      dpr={dpr}
      camera={{ position: [8, 8, 8], fov: 45 }}
      gl={{ 
        preserveDrawingBuffer: true, 
        antialias: false,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0
      }}
      ref={canvasRef}
      onPointerMissed={(e) => {
        if (!isDragging && e.type === 'click') setSelectedId(null);
      }}
    >
      <PerformanceMonitor onIncline={() => setDpr(2)} onDecline={() => setDpr(1)} />
      
      <color attach="background" args={[lighting.bg]} />
      
      {/* --- Lighting Setup (No External Files) --- */}
      <ambientLight intensity={lighting.ambient} />
      <directionalLight 
        position={lighting.sun} 
        intensity={lighting.intensity} 
        castShadow 
        shadow-bias={-0.0005}
        shadow-mapSize={[2048, 2048]} 
      />
      
      {/* Procedural Sky - Looks great, zero downloads */}
      {roomConfig.lightingMode !== 'Night' && (
        <Sky 
          sunPosition={lighting.sun} 
          turbidity={8} 
          rayleigh={6} 
          mieCoefficient={0.005} 
          mieDirectionalG={0.8} 
        />
      )}

      {/* --- Room & Structure --- */}
      <group position={[0, -0.01, 0]}>
        <Room 
          width={roomConfig.width} 
          depth={roomConfig.depth} 
          wallColor={roomConfig.wallColor} 
          floorColor={roomConfig.floorColor} 
        />
        
        {/* Contact Shadows ground objects without needing SSAO */}
        <ContactShadows 
          resolution={1024} 
          scale={50} 
          blur={2} 
          opacity={0.4} 
          far={1} 
          color="#000000" 
        />
        
        {/* {!is2D && mode !== 'Tour' && (
          <Grid 
            args={[roomConfig.width, roomConfig.depth]} 
            sectionColor="#6f6f6f" 
            cellColor="#a0a0a0" 
            position={[0, 0.01, 0]}
            fadeDistance={20} 
            infiniteGrid 
          />
        )} */}
      </group>

      {/* --- Furniture --- */}
      <Suspense fallback={<Html center><div style={{color:'black'}}>Loading...</div></Html>}>
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
            />
          ))}
        </group>
      </Suspense>

      {/* --- Effects --- */}
      {/* SSAO Removed temporarily as it was causing the 'NormalPass' crash */}
      {mode !== '2D' && (
         <EffectComposer multisampling={0}>
           <Bloom luminanceThreshold={1} mipmapBlur intensity={0.5} />
           <Vignette eskil={false} offset={0.1} darkness={0.4} />
         </EffectComposer>
      )}

      {/* --- Controls --- */}
      <CameraController mode={mode} />
      {mode === 'Tour' ? (
        <>
          <PointerLockControls selector="#tour-overlay" onUnlock={() => onTourUnlock && onTourUnlock()} />
          <TourControls active={mode === 'Tour'} onScreenshot={onScreenshot} />
        </>
      ) : (
        <>
          <OrbitControls 
            makeDefault 
            enabled={!isDragging}
            enableDamping 
            dampingFactor={0.1}
            maxPolarAngle={is2D ? 0 : Math.PI / 2 - 0.1}
            minDistance={2}
            maxDistance={50}
            screenSpacePanning={is2D}
          />
          {!is2D && (
            <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
              <GizmoViewport axisColors={['#ff3653', '#0adb50', '#2c8fdf']} labelColor="white" />
            </GizmoHelper>
          )}
        </>
      )}
    </Canvas>
  );
});

export default DesignCanvas;