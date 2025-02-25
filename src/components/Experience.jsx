import { Room } from "./Room";
import { Table } from "./Table";
import { Chair } from "./Chair";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { RigidBody, useRapier } from "@react-three/rapier";


export const Experience = ({ isDragging, setIsDragging, draggedItem, setDraggedItem }) => {
  const [furniture, setFurniture] = useState([]);
  const [previewPosition, setPreviewPosition] = useState(null);
  const { rapier, world } = useRapier();  // 获取物理世界实例
  const cameraRef = useRef();
  const [, getKeys] = useKeyboardControls();
  
  const moveDirection = new THREE.Vector3();
  const forward = new THREE.Vector3();
  const right = new THREE.Vector3();
  
  const planeRef = useRef();
  const roomRef = useRef();
  const previewRef = useRef();
  
  const { camera, raycaster, pointer } = useThree();

  // 修改虚拟地面的位置，将其设置得比房间地面稍高
  const VIRTUAL_GROUND_HEIGHT = 0.1; // 1cm higher than room floor

  // 修改家具的放置高度，考虑到虚拟地面的高度
  const FURNITURE_HEIGHTS = {
    table: VIRTUAL_GROUND_HEIGHT+0.1,
    chair: VIRTUAL_GROUND_HEIGHT+0.5
  };

  useFrame(() => {
    const keys = getKeys();
    
    const moveSpeed = 0.15;
    
    moveDirection.set(0, 0, 0);
    
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    right.set(forward.z, 0, -forward.x);
    
    if (keys.forward) moveDirection.add(forward);
    if (keys.back) moveDirection.sub(forward);
    if (keys.left) moveDirection.sub(right);
    if (keys.right) moveDirection.add(right);
    
    if (moveDirection.lengthSq() > 0) {
      moveDirection.normalize().multiplyScalar(moveSpeed);
      camera.position.add(moveDirection);
    }
  });

  // 添加键盘事件监听
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isDragging) {
        cancelPlacement();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDragging]);

  // 取消放置的方法
  const cancelPlacement = () => {
    setIsDragging(false);
    setDraggedItem(null);
    setPreviewPosition(null);
  };

  const FURNITURE_SIZES = {
    table: { x: 1, y: 0.7, z: 0.5 },
    chair: { x: 0.3, y: 0.5, z: 0.3 },
  };

  const checkPlacement = (position, draggedItem, furniture) => {
    return true;
  };

  const handlePointerMove = (event) => {
    if (isDragging) {
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObject(roomRef.current);
      
      if (intersects.length > 0) {
        const point = intersects[0].point;
        const height = FURNITURE_HEIGHTS[draggedItem] || 0;
        const position = [point.x, height, point.z];
        setPreviewPosition(position);
      }
    }
  };

  const handlePointerDown = (event) => {
    if (event.button !== 0) return;
    const canPlace = checkPlacement(position, draggedItem, furniture);
    if (isDragging && previewPosition && canPlace) {  // 只在可以放置时添加家具
      const uniqueId = `${draggedItem}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setFurniture(prev => [...prev, {
        type: draggedItem,
        position: previewPosition,
        id: uniqueId
      }]);
      setIsDragging(false);
      setDraggedItem(null);
      setPreviewPosition(null);
    }
  };

  // 修改右键处理
  const handleContextMenu = (event) => {
    // R3F 事件没有 preventDefault 方法
    if (isDragging) {
      cancelPlacement();
    }
  };

  // 添加 DOM 级别的右键阻止
  useEffect(() => {
    const preventDefault = (e) => e.preventDefault();
    // 阻止整个 canvas 的右键菜单
    document.querySelector('canvas').addEventListener('contextmenu', preventDefault);
    
    return () => {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        canvas.removeEventListener('contextmenu', preventDefault);
      }
    };
  }, []);

  return (
    <>
      <group 
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={(e) => {
          if (e.button === 2 && isDragging) {
            cancelPlacement();
          }
        }}
      >
        <ambientLight intensity={0.3} />
        
        <RigidBody type="fixed" colliders="trimesh">
          <Room ref={roomRef} scale={0.01} />
        </RigidBody>

        {/* <RigidBody type="fixed" colliders = 'trimesh'>
          <mesh 
            ref={planeRef}
            rotation={[-Math.PI / 2, 0, 0]} 
            position={[0, VIRTUAL_GROUND_HEIGHT, 0]}  // 设置新的高度
            visible={false}
          >
            <planeGeometry args={[200, 200]} />
            <meshBasicMaterial opacity={0.5} />
          </mesh>
        </RigidBody> */}

        {/* Preview with visual feedback */}
        {isDragging && previewPosition && (
          draggedItem === 'table' ? (
            <RigidBody colliders="cuboid">
              <Table 
                ref={previewRef}
                position={previewPosition}
                scale={0.4}
              />
            </RigidBody>
          ) : (
            <RigidBody colliders="cuboid">
              <Chair 
                ref={previewRef}
                position={previewPosition}
                scale={1}
              />
            </RigidBody>
          )
        )}

        {/* Placed furniture */}
        {furniture.map(item => {
          if (item.type === 'table') {
            return (
              <RigidBody 
                key={item.id}
                colliders="cuboid"
              >
                <Table 
                  position={item.position}
                  scale={0.4}
                />
              </RigidBody>
            );
          }
          if (item.type === 'chair') {
            return (
              <RigidBody 
                key={item.id}
                colliders="cuboid"
              >
                <Chair 
                  position={item.position}
                  scale={1}
                />
              </RigidBody>
            );
          }
          return null;
        })}
      </group>
    </>
  );
};
