import { Room } from "./Room";
import { Table } from "./Table";
import { Chair } from "./Chair";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { Box3Helper } from 'three';

export const Experience = ({ isDragging, setIsDragging, draggedItem, setDraggedItem }) => {
  const [furniture, setFurniture] = useState([]);
  const [previewPosition, setPreviewPosition] = useState(null);
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
    
    // 获取相机的前进方向并水平化
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    cameraDirection.y = 0;
    cameraDirection.normalize();
    
    // 获取水平的右方向向量
    const rightVector = new THREE.Vector3();
    rightVector.crossVectors(cameraDirection, new THREE.Vector3(0, 1, 0));
    rightVector.normalize();
    
    // 计算移动方向
    const moveVector = new THREE.Vector3(0, 0, 0);
    
    // 前后左右移动
    if (keys.forward) {
      moveVector.add(cameraDirection);
    }
    if (keys.back) {
      moveVector.sub(cameraDirection);
    }
    if (keys.left) {
      moveVector.sub(rightVector);
    }
    if (keys.right) {
      moveVector.add(rightVector);
    }

    // 上下移动
    if (keys.up) {
      moveVector.add(new THREE.Vector3(0, 1, 0));
    }
    if (keys.down) {
      moveVector.sub(new THREE.Vector3(0, 1, 0));
    }
    
    // 应用移动
    if (moveVector.lengthSq() > 0) {
      moveVector.normalize().multiplyScalar(moveSpeed);
      camera.position.add(moveVector);
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
    table: { x: 1.3, y: 1.5, z: 0.5 },
    chair: { x: 0.3, y: 0.8, z: 0.3 },
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

  // 添加碰撞检测函数
  const checkCollision = (position, type) => {
    if (!roomRef.current) return false;

    // 创建一个临时的包围盒来表示要放置的家具
    const furnitureBBox = new THREE.Box3();
    const furnitureSize = FURNITURE_SIZES[type];
    const halfSize = {
      x: furnitureSize.x / 2,
      y: furnitureSize.y / 2,
      z: furnitureSize.z / 2
    };
    
    furnitureBBox.min.set(
      position[0] - halfSize.x,
      0,
      position[2] - halfSize.z
    );
    furnitureBBox.max.set(
      position[0] + halfSize.x,
      0,
      position[2] + halfSize.z
    );

    let hasCollision = false;

    // 遍历房间的所有mesh进行碰撞检测
    roomRef.current.traverse((child) => {
      if (child.isMesh && !child.userData.ignoreCollision) {
        const meshBBox = new THREE.Box3().setFromObject(child);

        if (child.userData.isWall) {
          // 检查是否与墙有交集
          if (meshBBox.intersectsBox(furnitureBBox) && !meshBBox.containsBox(furnitureBBox)) {
            hasCollision = true;
          }
        } else {
          // 对于非墙且需要检测碰撞的物体
          if (furnitureBBox.intersectsBox(meshBBox)) {
            hasCollision = true;
          }
        }
      }
    });

    // 检查与其他家具的碰撞
    furniture.forEach(item => {
      const itemSize = FURNITURE_SIZES[item.type];
      const itemBBox = new THREE.Box3();
      const itemHalfSize = {
        x: itemSize.x / 2,
        y: itemSize.y / 2,
        z: itemSize.z / 2
      };

      itemBBox.min.set(
        item.position[0] - itemHalfSize.x,
        item.position[1] - itemHalfSize.y,
        item.position[2] - itemHalfSize.z
      );
      itemBBox.max.set(
        item.position[0] + itemHalfSize.x,
        item.position[1] + itemHalfSize.y,
        item.position[2] + itemHalfSize.z
      );

      if (furnitureBBox.intersectsBox(itemBBox)) {
        hasCollision = true;
      }
    });

    return !hasCollision;
  };

  const handlePointerDown = (event) => {
    if (event.button !== 0) return;
    if (isDragging && previewPosition) {
      const canPlace = checkCollision(previewPosition, draggedItem);
      if (canPlace) {
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

  // 添加一个函数来创建包围盒辅助对象
  const createBoundingBoxHelper = (position, type) => {
    const size = FURNITURE_SIZES[type];
    const box = new THREE.Box3(
      new THREE.Vector3(
        position[0] - size.x / 2,
        position[1] - size.y / 2,
        position[2] - size.z / 2
      ),
      new THREE.Vector3(
        position[0] + size.x / 2,
        position[1] + size.y / 2,
        position[2] + size.z / 2
      )
    );
    return <primitive object={new Box3Helper(box, 0x00ff00)} />;
  };

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
        
        <Room ref={roomRef} scale={0.01} />

        {/* Preview with bounding box */}
        {isDragging && previewPosition && (
          <>
            {draggedItem === 'table' ? (
              <Table 
                ref={previewRef}
                position={previewPosition}
                scale={0.4}
              />
            ) : (
              <Chair 
                ref={previewRef}
                position={previewPosition}
                scale={1}
              />
            )}
            {createBoundingBoxHelper(previewPosition, draggedItem)}
          </>
        )}

        {/* Placed furniture with bounding boxes */}
        {furniture.map(item => {
          if (item.type === 'table') {
            return (
              <group key={item.id}>
                <Table 
                  position={item.position}
                  scale={0.4}
                />
                {createBoundingBoxHelper(item.position, item.type)}
              </group>
            );
          }
          if (item.type === 'chair') {
            return (
              <group key={item.id}>
                <Chair 
                  position={item.position}
                  scale={1}
                />
                {createBoundingBoxHelper(item.position, item.type)}
              </group>
            );
          }
          return null;
        })}
      </group>
    </>
  );
};
