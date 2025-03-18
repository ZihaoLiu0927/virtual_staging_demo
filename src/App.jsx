import { Experience } from "./components/Experience";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import { useMemo, useState } from "react";
import { useControls } from "leva";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Toolbar } from "./components/Toolbar";
import { Physics } from "@react-three/rapier";
import { Suspense } from "react";
import { Loading } from "./components/Loading";
import { useProgress } from "@react-three/drei";

const CameraController = () => {
  const { camera } = useThree();
  
  const { position, rotation } = useControls({
    position: {
      value: { x: -3, y: 1, z: -4 },
      step: 0.1,
    },
    rotation: {
      value: { x: -0.2, y: 0, z: 0 },
      step: 0.1,
    },
  });

  useEffect(() => {
    camera.position.set(position.x, position.y, position.z);
    camera.rotation.set(rotation.x, rotation.y, rotation.z);
  }, [camera, position, rotation]);

  return null;
};

export const Controls = {
  forward: "forward",
  back: "back",
  left: "left",
  right: "right",
  jump: "jump",
};

export const App = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [furniture, setFurniture] = useState([]);
  const { progress } = useProgress();

  const handleDeleteFurniture = () => {
    if (selectedItem) {
      setFurniture(prev => prev.filter(item => item.id !== selectedItem));
      setSelectedItem(null);
    }
  };

  const { showPhysics } = useControls({
    showPhysics: {
      value: false,
      label: 'Show Physics'
    }
  });

  const map = useMemo(
    () => [
      { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
      { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
      { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
      { name: Controls.jump, keys: ["Space"] },
    ],
    []
  );

  return (
    <>
      {progress < 100 && <Loading progress={progress} />}
      <Toolbar 
        setIsDragging={setIsDragging}
        setDraggedItem={setDraggedItem}
        isDragging={isDragging}
      />
      <KeyboardControls map={map}>
        <Canvas>
          <ambientLight intensity={0.5} />
          <CameraController />
          <OrbitControls 
            enablePan={false} 
            enableZoom={true}
            enableDamping={true}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 4}
            rotateSpeed={0.5}
          />
          <Physics debug={showPhysics}>
            <Suspense fallback={null}>
              <Experience 
                isDragging={isDragging}
                setIsDragging={setIsDragging}
                draggedItem={draggedItem}
                setDraggedItem={setDraggedItem}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
                furniture={furniture}
                setFurniture={setFurniture}
              />
            </Suspense>
          </Physics>
        </Canvas>
      </KeyboardControls>

      {selectedItem && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000
          }}
        >
          <button
            onClick={handleDeleteFurniture}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Delete Selected Item
          </button>
        </div>
      )}
    </>
  );
};

export default App;
