import { Experience } from "./components/Experience";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import { useControls } from "leva";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Toolbar } from "./components/Toolbar";

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
    }
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
  up: "up",
  down: "down",
};

export const App = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  const map = useMemo(
    () => [
      { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
      { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
      { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
      { name: Controls.up, keys: ["KeyQ"] },
      { name: Controls.down, keys: ["KeyE"] },
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
          <CameraController />
          <OrbitControls 
            enablePan={false} 
            enableZoom={false}
            enableDamping={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 10}
            rotateSpeed={0.5}
          />
          <Experience 
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            draggedItem={draggedItem}
            setDraggedItem={setDraggedItem}
          />
        </Canvas>
      </KeyboardControls>
    </>
  );
};

export default App;
