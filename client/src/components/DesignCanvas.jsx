import React, { useRef, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, PointerLockControls, Sky, Stars, 
  GizmoHelper, GizmoViewport, SoftShadows, Grid 
} from '@react-three/drei';
import Furniture from './Furniture';
import Room from './Room';
import TourControls from './TourControls';
import FurnitureInfo from './FurnitureInfo';


const LIGHT_CONFIG = {
  Day: { ambient: 0.6, sun: [100, 100, 50], sky: true, bg: '#87CEEB' },
  Golden: { ambient: 0.5, sun: [10, 5, 10], sky: true, bg: '#ffcc00' },
  Night: { ambient: 0.1, sun: [0, -10, 0], sky: false, bg: '#111111' },
};

const DesignCanvas = forwardRef(({ 
  items, selectedId, setSelectedId, updateItem, mode, roomConfig, 
  onTourUnlock, onScreenshot, onHoverFurniture, onPlayerMove, onToggleMinimap 
}, ref) => {
  const canvasRef = useRef();
  
  // State to track if we are currently dragging an object
  const [isDragging, setIsDragging] = useState(false);

  useImperativeHandle(ref, () => ({
    takeScreenshot: () => canvasRef.current.toDataURL('image/jpeg', 0.8)
  }));

  const config = LIGHT_CONFIG[roomConfig.lightingMode] || LIGHT_CONFIG.Day;

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [10, 10, 10], fov: 50 }}
      gl={{ preserveDrawingBuffer: true, antialias: true }}
      ref={canvasRef}
      onPointerMissed={() => {
        if (!isDragging) setSelectedId(null);
      }}
    >
      <color attach="background" args={[config.bg]} />
      
      {/* --- Environment --- */}
      <ambientLight intensity={config.ambient} />
      {config.sky ? (
        <Sky sunPosition={config.sun} turbidity={8} rayleigh={6} />
      ) : (
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      )}
      
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={1.2} 
        castShadow 
        shadow-mapSize={[2048, 2048]} 
      />
      <SoftShadows size={15} focus={0.5} samples={12} />

      {/* --- Room Geometry --- */}
      <group position={[0, -0.01, 0]}>
        <Room 
          width={roomConfig.width} 
          depth={roomConfig.depth} 
          wallColor={roomConfig.wallColor} 
          floorColor={roomConfig.floorColor} 
        />
        
        {mode !== 'Tour' && (
          <Grid 
            args={[roomConfig.width, roomConfig.depth]} 
            sectionColor="#555" 
            cellColor="#777" 
            infiniteGrid={false} 
          />
        )}
      </group>

      {/* --- Furniture Items --- */}
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

      {/* --- Controls --- */}
      {mode === 'Tour' ? (
        <>
          <PointerLockControls 
            selector="#tour-overlay" 
            onUnlock={() => { if (onTourUnlock) onTourUnlock(); }} 
          />
          <TourControls 
            active={mode === 'Tour'} 
            onScreenshot={onScreenshot}
            roomWidth={roomConfig.width}
            roomDepth={roomConfig.depth}
            onPlayerMove={onPlayerMove}
            onToggleMinimap={onToggleMinimap}
          />
          <FurnitureInfo
            active={mode === 'Tour'}
            items={items}
            onHoverItem={onHoverFurniture}
          />
        </>
      ) : (
        <>
          <OrbitControls 
            makeDefault 
            enabled={!isDragging}
            enableDamping 
            dampingFactor={0.05}
            maxPolarAngle={mode === '2D' ? 0 : Math.PI / 2 - 0.05}
            minDistance={2}
            maxDistance={50}
          />
          <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
            <GizmoViewport axisColors={['#d15656', '#4fa853', '#4a7ecf']} labelColor="white" />
          </GizmoHelper>
        </>
      )}

      
    </Canvas>
  );
});

export default DesignCanvas;
