import { Room } from "./Room";
import { Table } from "./Table";
import { Chair } from "./Chair";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { RigidBody, useRapier } from "@react-three/rapier";


export const Experience = ({ 
  isDragging, 
  setIsDragging, 
  draggedItem, 
  setDraggedItem,
  selectedItem,
  setSelectedItem,
  furniture,
  setFurniture
}) => {
  const [previewPosition, setPreviewPosition] = useState(null);
  const { rapier, world } = useRapier();  // 获取物理世界实例
  const cameraRef = useRef();
  const [, getKeys] = useKeyboardControls();
  
  const moveDirection = new THREE.Vector3();
  const forward = new THREE.Vector3();
  const right = new THREE.Vector3();
  
  const roomRef = useRef();
  
  const { camera, raycaster, pointer } = useThree();

  const VIRTUAL_GROUND_HEIGHT = 0.1; // 1cm higher than room floor

  const FURNITURE_HEIGHTS = {
    table: VIRTUAL_GROUND_HEIGHT+0.1,
    chair: VIRTUAL_GROUND_HEIGHT+0.5
  };
  const moveSpeed = 0.15;

  useFrame(() => {
    if (selectedItem) {
      return null;
    }
      
    const keys = getKeys();
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
      if (event.key === 'Escape') {
        if (isDragging) {
          cancelPlacement();
        } else if (selectedItem) {
          setSelectedItem(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDragging, selectedItem]);

  const cancelPlacement = () => {
    setIsDragging(false);
    setDraggedItem(null);
    setPreviewPosition(null);
  };

  const FURNITURE_SIZES = {
    table: { x: 0.3, y: 0.2, z: 0.05 },
    chair: { x: 0.3, y: 0.5, z: 0.3 },
  };

  const checkPlacement = (position, draggedItem, furniture) => {
    return true;
  };

  const handlePointerMove = (event) => {
    if (!isDragging || !draggedItem) return;
    
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObject(roomRef.current);
    
    if (intersects.length > 0) {
      const point = intersects[0].point;
      const height = FURNITURE_HEIGHTS[draggedItem] || 0;
      const position = [point.x, height, point.z];
      setPreviewPosition(position);
    }
  };

  const handlePointerDown = (event) => {
    if (event.button !== 0) return;

    if (isDragging && previewPosition) {
      event.stopPropagation();
      
      const canPlace = checkPlacement(previewPosition, draggedItem, furniture);
      if (canPlace) {
        setIsDragging(false);
        setDraggedItem(null);
        
        const uniqueId = `${draggedItem}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        setFurniture(prev => [...prev, {
          type: draggedItem,
          position: previewPosition,
          id: uniqueId
        }]);
        
        setPreviewPosition(null);
      }
    }
  };

  // 添加选中物品的处理函数
  const handleItemSelect = (event, itemId) => {
    event.stopPropagation();
    setSelectedItem(itemId);
  };

  return (
    <>
      <group 
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onContextMenu={(e) => {
          e.preventDefault();
          if (isDragging) {
            cancelPlacement();
          } else if (selectedItem) {
            setSelectedItem(null);
          }
        }}
      >
        <ambientLight intensity={0.3} />
        
        <RigidBody type="fixed" colliders="trimesh">
          <Room ref={roomRef} scale={0.01} />
        </RigidBody>

        {/* Preview with visual feedback */}
        {isDragging && previewPosition && (
          draggedItem === 'table' ? (
            <Table 
              position={previewPosition}
              scale={0.4}
            />
          ) : (
            <Chair 
              position={previewPosition}
              scale={1}
            />
          )
        )}

        {/* Placed furniture */}
        {furniture.map(item => {
          const isSelected = item.id === selectedItem;
          
          if (item.type === 'table') {
            return (
              <Table 
                key={item.id}
                position={item.position}
                scale={0.35}
                onClick={(e) => handleItemSelect(e, item.id)}
                isSelected={isSelected}
              />
            );
          }
          
          if (item.type === 'chair') {
            return (
              <Chair 
                key={item.id}
                position={item.position}
                scale={1}
                onClick={(e) => handleItemSelect(e, item.id)}
                isSelected={isSelected}
              />
            );
          }
          return null;
        })}
      </group>
    </>
  );
};
