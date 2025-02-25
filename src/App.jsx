import { Experience } from "./components/Experience";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import { useControls } from "leva";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Toolbar } from "./components/Toolbar";
import { Physics } from "@react-three/rapier";

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
};

export const App = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

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
    ],
    []
  );

  return (
    <>
      <Toolbar 
        setIsDragging={setIsDragging}
        setDraggedItem={setDraggedItem}
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
          <Physics debug = {showPhysics}>
            <Experience 
              isDragging={isDragging}
              setIsDragging={setIsDragging}
              draggedItem={draggedItem}
              setDraggedItem={setDraggedItem}
            />
          </Physics>
        </Canvas>
      </KeyboardControls>
    </>
  );
};

export default App;
