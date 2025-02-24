import { Room } from "./Room";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

export const Experience = () => {
  const cameraRef = useRef();
  const [, getKeys] = useKeyboardControls();
  
  const moveDirection = new THREE.Vector3();
  const forward = new THREE.Vector3();
  const right = new THREE.Vector3();
  
  useFrame((state) => {
    const keys = getKeys();
    
    const moveSpeed = 0.15;
    
    moveDirection.set(0, 0, 0);
    
    state.camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    right.set(forward.z, 0, -forward.x);
    
    if (keys.forward) moveDirection.add(forward);
    if (keys.back) moveDirection.sub(forward);
    if (keys.left) moveDirection.sub(right);
    if (keys.right) moveDirection.add(right);
    
    if (moveDirection.lengthSq() > 0) {
      moveDirection.normalize().multiplyScalar(moveSpeed);
      state.camera.position.add(moveDirection);
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <Room scale={0.01} />
    </>
  );
};
