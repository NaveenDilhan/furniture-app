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

const CameraController = ({ mode, roomConfig }) => {
  const { camera } = useThree();
  const controls = useThree((state) => state.controls);

  useEffect(() => {
    if (!controls) return;
    controls.reset();

    if (mode === '2D') {
      const maxDim = Math.max(roomConfig.width || 10, roomConfig.depth || 10);
      camera.position.set(0, maxDim * 1.5, 0.001); 
      camera.lookAt(0, 0, 0);
      controls.target.set(0, 0, 0);
    } else if (mode === '3D') {
      camera.position.set(12, 20, 12);
      camera.lookAt(0, 0, 0);
      controls.target.set(0, 0, 0);
    }
    
    controls.update();
  }, [mode, camera, controls, roomConfig.width, roomConfig.depth]);

  return null;
};

const DesignCanvas = forwardRef(({ 
   items, selectedId, setSelectedId, updateItem, deleteItem, 
   mode, roomConfig, setRoomConfig, onTourUnlock 
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

      {!is2D && roomConfig.shadowsEnabled !== false && (
        <SoftShadows size={10} samples={12} focus={0.5} />
      )}

      <Environment files={config.file} background={false} blur={0.5} />

      {roomConfig.lightingMode !== 'Night' && (
        <Sky sunPosition={config.sun} turbidity={8} rayleigh={6} />
      )}

      <group position={[0, 0, 0]}>
        <Room
          roomConfig={roomConfig}
          setRoomConfig={setRoomConfig}
          is2D={is2D}
        />
        
        {is2D && roomConfig.showGrid !== false && !roomConfig.editFloorMode && (
           <Grid 
             args={[100, 100]} 
             sectionSize={1}
             sectionColor="#666666"
             cellColor="#cccccc"    
             position={[0, 0.01, 0]} 
             infiniteGrid 
             fadeDistance={300} 
             opacity={0.6}
           />
        )}

        {!is2D && (
           <ContactShadows 
             position={[0, 0.01, 0]} 
             resolution={1024} 
             scale={Math.max(roomConfig.width || 10, roomConfig.depth || 10) * 2} 
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

      {!is2D && (
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={1.5} mipmapBlur intensity={0.4} radius={0.6} />
          <Vignette eskil={false} offset={0.1} darkness={0.5} />
          <Noise opacity={0.02} />
        </EffectComposer>
      )}

      <CameraController mode={mode} roomConfig={roomConfig}/>

      {isTour ? (
        <>
          <PointerLockControls selector="#tour-overlay" onUnlock={onTourUnlock} />
          <TourControls active={true} roomConfig={roomConfig} />
        </>
      ) : (
        <>
          <OrbitControls 
            makeDefault 
            enabled={!isDragging}
            enableDamping 
            dampingFactor={0.1}
            enableRotate={!is2D}
            screenSpacePanning={is2D} 
            minPolarAngle={0}
            maxPolarAngle={is2D ? 0 : Math.PI / 2.1} 
            minDistance={is2D ? 10 : 2}
            maxDistance={is2D ? 300 : 50}
          />
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