import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function TourControls({ active, onScreenshot, roomWidth = 15, roomDepth = 15, onPlayerMove, onToggleMinimap }) {
  const { camera, scene } = useThree();
  const moveState = useRef({ forward: false, backward: false, left: false, right: false });
  const speed = 5;
  const sprintMultiplier = 1.8;
  const isSprinting = useRef(false);
  const fovRef = useRef(50);
  
  // Head bob effect
  const bobTime = useRef(0);
  const isMoving = useRef(false);

  // Raycaster for furniture collision
  const raycaster = useRef(new THREE.Raycaster());
  const collisionDistance = 0.8; // How close before collision stops movement

  // Throttle player position updates
  const frameCount = useRef(0);

  useEffect(() => {
    if (!active) return;

    // Set camera to eye-level, start near the center of the room
    camera.position.set(0, 1.6, roomDepth / 4);
    camera.fov = 50;
    camera.updateProjectionMatrix();
    fovRef.current = 50;

    const onKeyDown = (e) => {
      switch (e.code) {
        case 'KeyW': moveState.current.forward = true; break;
        case 'KeyS': moveState.current.backward = true; break;
        case 'KeyA': moveState.current.left = true; break;
        case 'KeyD': moveState.current.right = true; break;
        case 'ShiftLeft':
        case 'ShiftRight':
          isSprinting.current = true;
          break;
        case 'KeyP':
          if (onScreenshot) onScreenshot();
          break;
        case 'KeyM':
          if (onToggleMinimap) onToggleMinimap();
          break;
      }
    };

    const onKeyUp = (e) => {
      switch (e.code) {
        case 'KeyW': moveState.current.forward = false; break;
        case 'KeyS': moveState.current.backward = false; break;
        case 'KeyA': moveState.current.left = false; break;
        case 'KeyD': moveState.current.right = false; break;
        case 'ShiftLeft':
        case 'ShiftRight':
          isSprinting.current = false;
          break;
      }
    };

    // Scroll wheel zoom (changes FOV)
    const onWheel = (e) => {
      fovRef.current += e.deltaY * 0.05;
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
      moveState.current = { forward: false, backward: false, left: false, right: false };
      isSprinting.current = false;
      camera.fov = 50;
      camera.updateProjectionMatrix();
    };
  }, [active, camera, onScreenshot, roomWidth, roomDepth]);

  // Check collision in a given direction
  const checkCollision = (origin, direction) => {
    raycaster.current.set(origin, direction.normalize());
    raycaster.current.far = collisionDistance;
    
    // Get all meshes in the scene (furniture objects only, skip floor/walls/sky)
    const meshes = [];
    scene.traverse((child) => {
      if (child.isMesh && child.userData?.furnitureId) {
        meshes.push(child);
      }
    });

    const intersects = raycaster.current.intersectObjects(meshes, false);
    return intersects.length > 0;
  };

  useFrame((_, delta) => {
    if (!active) return;

    const { forward, backward, left, right } = moveState.current;
    isMoving.current = forward || backward || left || right;

    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3(0, 0, Number(backward) - Number(forward));
    const sideVector = new THREE.Vector3(Number(left) - Number(right), 0, 0);

    const currentSpeed = speed * (isSprinting.current ? sprintMultiplier : 1);

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(currentSpeed * delta)
      .applyEuler(camera.rotation);

    // Calculate new position
    let newX = camera.position.x + direction.x;
    let newZ = camera.position.z + direction.z;

    // Room boundary collision - keep player inside the room walls
    const halfWidth = roomWidth / 2 - 0.5;
    const halfDepth = roomDepth / 2 - 0.5;

    newX = Math.max(-halfWidth, Math.min(halfWidth, newX));
    newZ = Math.max(-halfDepth, Math.min(halfDepth, newZ));

    // Furniture collision detection using raycasting
    if (isMoving.current) {
      const playerPos = new THREE.Vector3(camera.position.x, 0.8, camera.position.z);
      const moveDir = new THREE.Vector3(direction.x, 0, direction.z);
      
      if (moveDir.length() > 0.001) {
        const blocked = checkCollision(playerPos, moveDir.clone());
        
        if (blocked) {
          // Try sliding along X axis only
          const slideX = new THREE.Vector3(direction.x, 0, 0);
          if (slideX.length() > 0.001 && !checkCollision(playerPos, slideX.clone())) {
            newX = camera.position.x + direction.x;
            newZ = camera.position.z; // Don't move Z
          } 
          // Try sliding along Z axis only
          else {
            const slideZ = new THREE.Vector3(0, 0, direction.z);
            if (slideZ.length() > 0.001 && !checkCollision(playerPos, slideZ.clone())) {
              newX = camera.position.x; // Don't move X
              newZ = camera.position.z + direction.z;
            } else {
              // Fully blocked - don't move
              newX = camera.position.x;
              newZ = camera.position.z;
            }
          }

          // Re-clamp after slide
          newX = Math.max(-halfWidth, Math.min(halfWidth, newX));
          newZ = Math.max(-halfDepth, Math.min(halfDepth, newZ));
        }
      }
    }

    camera.position.x = newX;
    camera.position.z = newZ;

    // Head bob effect when moving
    if (isMoving.current) {
      bobTime.current += delta * (isSprinting.current ? 12 : 8);
      const bobAmount = Math.sin(bobTime.current) * 0.03;
      camera.position.y = 1.6 + bobAmount;
    } else {
      // Smoothly return to normal height when stopped
      camera.position.y += (1.6 - camera.position.y) * 0.1;
      bobTime.current = 0;
    }

    // Report player position to Dashboard for minimap (throttled)
    frameCount.current++;
    if (onPlayerMove && frameCount.current % 5 === 0) {
      onPlayerMove({
        x: camera.position.x,
        z: camera.position.z,
        rotation: camera.rotation.y
      });
    }
  });

  return null;
}
