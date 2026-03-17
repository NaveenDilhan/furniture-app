import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function TourControls({ active, onScreenshot, roomConfig }) {
  const { camera } = useThree();
  const moveState = useRef({ forward: false, backward: false, left: false, right: false });
  const speed = 5;
  const fovRef = useRef(50); // Default FOV for zoom

  useEffect(() => {
    if (!active) return;

    // Set camera to eye-level when entering tour
    camera.position.set(0, 1.6, 5);
    camera.fov = 50;
    camera.updateProjectionMatrix();
    fovRef.current = 50;

    const onKeyDown = (e) => {
      switch (e.code) {
        case 'KeyW': moveState.current.forward = true; break;
        case 'KeyS': moveState.current.backward = true; break;
        case 'KeyA': moveState.current.left = true; break;
        case 'KeyD': moveState.current.right = true; break;
        case 'KeyP':
          if (onScreenshot) onScreenshot();
          break;
      }
    };

    const onKeyUp = (e) => {
      switch (e.code) {
        case 'KeyW': moveState.current.forward = false; break;
        case 'KeyS': moveState.current.backward = false; break;
        case 'KeyA': moveState.current.left = false; break;
        case 'KeyD': moveState.current.right = false; break;
      }
    };

    // Scroll wheel zoom (changes FOV)
    const onWheel = (e) => {
      fovRef.current += e.deltaY * 0.05;
      // Clamp FOV between 20 (zoomed in) and 90 (zoomed out)
      fovRef.current = Math.max(20, Math.min(90, fovRef.current));
      camera.fov = fovRef.current;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('wheel', onWheel);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('wheel', onWheel);
      // Reset all movement when leaving tour
      moveState.current = { forward: false, backward: false, left: false, right: false };
      // Reset FOV back to default
      camera.fov = 50;
      camera.updateProjectionMatrix();
    };
  }, [active, camera, onScreenshot]);

  // DYNAMIC WALL COLLISION BOUNDARIES
  const wallGap = 0.5; // Gap to prevent camera near-plane from clipping through walls
  const widthLimit = Math.max(0, (roomConfig?.width || 15) / 2 - wallGap);
  const depthLimit = Math.max(0, (roomConfig?.depth || 15) / 2 - wallGap);

  useFrame((_, delta) => {
    if (!active) return;

    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3(0, 0, Number(moveState.current.backward) - Number(moveState.current.forward));
    const sideVector = new THREE.Vector3(Number(moveState.current.left) - Number(moveState.current.right), 0, 0);

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(speed * delta)
      .applyEuler(camera.rotation);

    // Calculate new potential position
    const newX = camera.position.x + direction.x;
    const newZ = camera.position.z + direction.z;

    // Apply Wall Collision Detection by clamping the X and Z axes
    camera.position.x = THREE.MathUtils.clamp(newX, -widthLimit, widthLimit);
    camera.position.z = THREE.MathUtils.clamp(newZ, -depthLimit, depthLimit);
    
    // Keep Y position fixed at eye level (no flying)
    camera.position.y = 1.6;
  });

  return null;
}