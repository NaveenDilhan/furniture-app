import React, { useRef, useMemo, useState, useEffect } from 'react';
import { TransformControls, Html, useGLTF, Edges } from '@react-three/drei';
import * as THREE from 'three';

function getTargetSizeByType(type = '', roomConfig) {
  const t = type.toLowerCase();
  const avgRoom = ((roomConfig?.width || 15) + (roomConfig?.depth || 15)) / 2;
  const roomFactor = avgRoom <= 10 ? 0.9 : avgRoom <= 18 ? 1 : 1.1;

  if (t.includes('bed')) return 2.2 * roomFactor;
  if (t.includes('sofa') || t.includes('couch')) return 1.8 * roomFactor;
  if (t.includes('dining table')) return 1.6 * roomFactor;
  if (t.includes('table') || t.includes('desk')) return 1.4 * roomFactor;
  if (t.includes('chair') || t.includes('stool')) return 1.0 * roomFactor;
  if (t.includes('lamp')) return 1.2 * roomFactor;
  if (t.includes('wardrobe') || t.includes('cabinet') || t.includes('closet')) return 2.0 * roomFactor;
  if (t.includes('shelf') || t.includes('bookshelf')) return 1.8 * roomFactor;
  if (t.includes('tv stand')) return 1.4 * roomFactor;

  return 1.4 * roomFactor;
}

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

  const modelPath = modelUrl || `/models/${type.toLowerCase()}.glb`;
  const { scene } = useGLTF(modelPath);

  const clone = useMemo(() => {
    if (!scene) return null;

    const clonedScene = scene.clone();

    clonedScene.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;

        if (node.material) {
          node.material = node.material.clone();
        }
      }
    });

    return clonedScene;
  }, [scene]);

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

  const widthLimit = Math.max(0, (roomConfig?.width || 15) / 2 - 0.5);
  const depthLimit = Math.max(0, (roomConfig?.depth || 15) / 2 - 0.5);

  const showTransform = isSelected && mode !== 'Tour';

  const formattedScale = Array.isArray(scale) ? scale : [scale, scale, scale];

  const modelMetrics = useMemo(() => {
    if (!clone) {
      return {
        object: null,
        autoScale: 1,
        yOffset: 0,
        labelHeight: 2,
      };
    }

    const temp = clone.clone();
    const box = new THREE.Box3().setFromObject(temp);
    const size = new THREE.Vector3();
    box.getSize(size);

    const maxDim = Math.max(size.x, size.y, size.z, 0.001);
    const targetSize = getTargetSizeByType(type, roomConfig);

    const autoScale = targetSize / maxDim;
    const yOffset = -box.min.y * autoScale;
    const labelHeight = Math.max(1.2, size.y * autoScale + 0.5);

    return {
      object: clone,
      autoScale,
      yOffset,
      labelHeight,
    };
  }, [clone, type, roomConfig]);

  const finalScale = [
    modelMetrics.autoScale * formattedScale[0],
    modelMetrics.autoScale * formattedScale[1],
    modelMetrics.autoScale * formattedScale[2],
  ];

  const handleTransformChange = () => {
    if (!meshRef.current) return;

    const currentPos = meshRef.current.position;

    if (currentPos.y !== 0) currentPos.y = 0;

    currentPos.x = THREE.MathUtils.clamp(currentPos.x, -widthLimit, widthLimit);
    currentPos.z = THREE.MathUtils.clamp(currentPos.z, -depthLimit, depthLimit);
  };

  const handleTransformEnd = () => {
    if (setIsDragging) setIsDragging(false);

    if (meshRef.current) {
      onChange(id, {
        position: meshRef.current.position.toArray(),
        rotation: meshRef.current.rotation.toArray(),
        scale: formattedScale,
      });
    }
  };

  useEffect(() => {
    if (hovered && mode !== 'Tour') {
      document.body.style.cursor = 'grab';
    } else {
      document.body.style.cursor = 'auto';
    }

    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered, mode]);

  return (
    <>
      {showTransform && (
        <TransformControls
          object={meshRef}
          mode="translate"
          showY={false}
          translationSnap={0.1}
          rotationSnap={Math.PI / 12}
          onMouseDown={() => setIsDragging && setIsDragging(true)}
          onObjectChange={handleTransformChange}
          onMouseUp={handleTransformEnd}
        />
      )}

      <group
        ref={meshRef}
        position={position}
        rotation={rotation}
        scale={finalScale}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        dispose={null}
      >
        {modelMetrics.object && (
          <group position={[0, modelMetrics.yOffset, 0]}>
            <primitive object={modelMetrics.object} />
          </group>
        )}

        {(isSelected || hovered) && (
          <Edges
            scale={1.02}
            threshold={15}
            color={isSelected ? '#4facfe' : '#a1a1aa'}
            opacity={isSelected ? 1 : 0.6}
            transparent
          />
        )}

        {type === 'Lamp' && (
          <group position={[0, Math.max(1, modelMetrics.labelHeight - 0.6), 0]}>
            <pointLight
              intensity={2}
              distance={6}
              color="#ffeebb"
              castShadow
              shadow-bias={-0.001}
            />
            <mesh>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        )}

        {isSelected && (
          <Html position={[0, modelMetrics.labelHeight, 0]} center zIndexRange={[100, 0]}>
            <div
              style={{
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
                userSelect: 'none'
              }}
            >
              {type}
              <div
                style={{
                  fontSize: '10px',
                  color: '#94a3b8',
                  marginTop: '4px',
                  fontWeight: '400'
                }}
              >
                X: {position[0].toFixed(1)}m | Z: {position[2].toFixed(1)}m
              </div>
            </div>
          </Html>
        )}
      </group>
    </>
  );
}