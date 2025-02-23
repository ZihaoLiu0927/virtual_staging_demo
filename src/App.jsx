import { Experience } from "./components/Experience";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import { useMemo } from "react";

export const Controls = {
  forward: "forward",
  back: "back",
  left: "left",
  right: "right",
};

export const App = () => {
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
      <KeyboardControls map={map}>
        <Canvas camera={{ position: [0, 3, 8], fov: 75 }}>
          <OrbitControls 
            enablePan={false} 
            enableZoom={true}
            enableDamping={true}
            rotateSpeed={0.5}
          />
          <Experience />
        </Canvas>
      </KeyboardControls>
    </>
  );
};

export default App;
