import { Room } from "./Room";
import { Table } from "./Table";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls, Html } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";
import { Toolbar } from "./Toolbar";

export const Experience = () => {
  const [furniture, setFurniture] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const cameraRef = useRef();
  const [, getKeys] = useKeyboardControls();
  
  const moveDirection = new THREE.Vector3();
  const forward = new THREE.Vector3();
  const right = new THREE.Vector3();
  
  const planeRef = useRef();
  
  const { camera, raycaster, pointer } = useThree();

  // 创建一个碰撞检测的包围盒
  const checkCollision = (position, size = { x: 2, z: 1 }) => {
    // 新家具的包围盒
    const newBox = new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(position[0], 0, position[2]),
      new THREE.Vector3(size.x, 1, size.z)
    );

    // 检查与现有家具的碰撞
    return furniture.some(item => {
      const itemBox = new THREE.Box3().setFromCenterAndSize(
        new THREE.Vector3(item.position[0], 0, item.position[2]),
        new THREE.Vector3(size.x, 1, size.z)
      );
      return newBox.intersectsBox(itemBox);
    });
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

  const handlePointerMove = (event) => {
    if (isDragging && draggedItem) {
      // 更新射线
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObject(planeRef.current);
      
      if (intersects.length > 0) {
        const point = intersects[0].point;
        const position = [point.x, 0, point.z];
        setPreviewPosition(position);
        setCanPlace(!checkCollision(position));
      }
    }
  };

  const handlePointerUp = () => {
    if (isDragging && draggedItem && previewPosition && canPlace) {
      const uniqueId = `${draggedItem}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setFurniture(prev => [...prev, {
        type: draggedItem,
        position: previewPosition,
        id: uniqueId
      }]);
    }
    setIsDragging(false);
    setDraggedItem(null);
    setPreviewPosition(null);
  };

  // 可以添加一个预览效果
  const [previewPosition, setPreviewPosition] = useState(null);
  const [canPlace, setCanPlace] = useState(true);

  return (
    <>
      <group onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
        <ambientLight intensity={0.3} />
        <Room scale={0.01} />
        
        {/* Invisible plane for drag and drop */}
        <mesh 
          ref={planeRef}
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, 0, 0]}
          visible={false}
        >
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>

        {/* Preview */}
        {previewPosition && (
          <Table 
            position={previewPosition}
            scale={0.3}
          />
        )}

        {/* Placed furniture */}
        {furniture.map(item => {
          if (item.type === 'table') {
            return (
              <Table 
                key={item.id}
                position={item.position}
                scale={0.4}
              />
            );
          }
          return null;
        })}
      </group>

      {/* Toolbar */}
      <Html fullscreen>
        <div className="toolbar">
          <div 
            className="toolbar-item"
            onPointerDown={() => {
              setIsDragging(true);
              setDraggedItem('table');
            }}
          >
            <div className="preview">
              <img src="/models/table/table.png" alt="Table" />
            </div>
            <span>Table</span>
          </div>
        </div>
      </Html>
    </>
  );
};
