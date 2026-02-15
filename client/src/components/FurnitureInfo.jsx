import { useRef, useState, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * FurnitureInfo - Raycasts from the camera center (crosshair) during Tour mode
 * to detect which furniture the user is looking at, and reports it via onHoverItem callback.
 */
export default function FurnitureInfo({ active, items, onHoverItem }) {
  const { camera, scene } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const center = useRef(new THREE.Vector2(0, 0)); // Screen center = crosshair
  const lastHoveredId = useRef(null);
  const frameCount = useRef(0);

  useFrame(() => {
    if (!active) {
      if (lastHoveredId.current !== null) {
        lastHoveredId.current = null;
        onHoverItem(null);
      }
      return;
    }

    // Only raycast every 3 frames for performance
    frameCount.current++;
    if (frameCount.current % 3 !== 0) return;

    // Cast ray from camera center (where crosshair is)
    raycaster.current.setFromCamera(center.current, camera);
    raycaster.current.far = 15; // Max detection distance

    // Collect all meshes in the scene
    const meshes = [];
    scene.traverse((child) => {
      if (child.isMesh && child.geometry) {
        meshes.push(child);
      }
    });

    const intersects = raycaster.current.intersectObjects(meshes, false);

    if (intersects.length > 0) {
      const hit = intersects[0];
      const hitObject = hit.object;

      // Walk up the parent chain to find the furniture group
      // Furniture items are wrapped in a <group> with position/rotation/scale
      let furnitureGroup = hitObject;
      while (furnitureGroup.parent && !furnitureGroup.userData?.furnitureId) {
        furnitureGroup = furnitureGroup.parent;
      }

      const furnitureId = furnitureGroup.userData?.furnitureId;

      if (furnitureId && furnitureId !== lastHoveredId.current) {
        lastHoveredId.current = furnitureId;
        const item = items.find(i => i.id === furnitureId);
        if (item) {
          onHoverItem({
            type: item.type,
            distance: hit.distance.toFixed(1),
            position: item.position
          });
        }
      } else if (!furnitureId) {
        // Hit something that's not furniture (wall, floor)
        if (lastHoveredId.current !== null) {
          lastHoveredId.current = null;
          onHoverItem(null);
        }
      }
    } else {
      // Nothing hit
      if (lastHoveredId.current !== null) {
        lastHoveredId.current = null;
        onHoverItem(null);
      }
    }
  });

  return null;
}
