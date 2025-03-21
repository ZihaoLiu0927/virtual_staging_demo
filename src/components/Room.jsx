/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 public/models/sample1/scene.gltf -o src/components/Room.jsx -r public 
Author: OverLord (https://sketchfab.com/San.Dro)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/room-7bb735cc3db44e8e9ff58de6b1559a63
Title: Room
*/

import React, { forwardRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useEffect } from 'react'

export const Room = forwardRef((props, ref) => {
  const { nodes, materials } = useGLTF('./models/sample1/scene.gltf')

  return (
    <group ref={ref} {...props} dispose={null}>
      <group position={[-231.654, 37.583, 118.229]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
        <mesh geometry={nodes.Drawer_1_Drawer_0.geometry} material={materials.Drawer} />
        <mesh geometry={nodes.Drawer_1_Drawer_legs_0.geometry} material={materials.Drawer_legs} />
        <mesh geometry={nodes.Drawer_1_Drawer_handle_0.geometry} material={materials.Drawer_handle} />
      </group>
      <group position={[-233.028, 74.371, 122.435]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
        <mesh geometry={nodes.Lamp_1_Lamp_stand_0.geometry} material={materials.Lamp_stand} />
        <mesh geometry={nodes.Lamp_1_Lamp_head_0.geometry} material={materials.Lamp_head} />
        <mesh geometry={nodes.Lamp_1_Lamp_wire_0.geometry} material={materials.Lamp_wire} />
      </group>
      <group position={[504.314, 86.671, -422.143]} rotation={[-Math.PI / 2, 0, -2.188]} scale={100}>
        <mesh geometry={nodes.Chair_Chair_seat_0.geometry} material={materials.Chair_seat} />
        <mesh geometry={nodes.Chair_Chair_Leg_0.geometry} material={materials.Chair_Leg} />
        <mesh geometry={nodes.Chair_Chair_bolts_0.geometry} material={materials.Chair_bolts} />
      </group>
      <group position={[236.27, 37.583, 118.229]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
        <mesh geometry={nodes.Drawer_2_Drawer_0.geometry} material={materials.Drawer} />
        <mesh geometry={nodes.Drawer_2_Drawer_legs_0.geometry} material={materials.Drawer_legs} />
        <mesh geometry={nodes.Drawer_2_Drawer_handle_0.geometry} material={materials.Drawer_handle} />
      </group>
      <group position={[234.896, 74.371, 122.435]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
        <mesh geometry={nodes.Lamp_2_Lamp_stand_0.geometry} material={materials.Lamp_stand} />
        <mesh geometry={nodes.Lamp_2_Lamp_head_0.geometry} material={materials.Lamp_head} />
        <mesh geometry={nodes.Lamp_2_Lamp_wire_0.geometry} material={materials.Lamp_wire} />
      </group>
      <mesh geometry={nodes.Walls_Wall_0.geometry} material={materials.Wall} position={[-1.846, 323.764, -66.151]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
      <mesh geometry={nodes.Wall_marble_Material002_0.geometry} material={materials['Material.002']} position={[0, 189.017, 164.858]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
      <mesh geometry={nodes.Wall_outside_Wall_outside_0.geometry} material={materials.Wall_outside} position={[858.701, 189.017, 578.636]} rotation={[-Math.PI / 2, 0, 0]} scale={[1192.902, 17.853, 198.682]} />
      <mesh geometry={nodes.Bed_Bed_0.geometry} material={materials.material} position={[0.197, 20.914, -23.821]} rotation={[-Math.PI / 2, 0, 0]} scale={[158.336, 171.85, 23.735]} />
      <mesh geometry={nodes.Matress_Matress_0.geometry} material={materials.Matress} position={[0.197, 56.387, -19.032]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
      <mesh geometry={nodes.Blanket_Blanket_0.geometry} material={materials.Blanket} position={[0.726, 67.622, -65.148]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
      <mesh geometry={nodes.Pillow_1_Pillow_0.geometry} material={materials.Pillow} position={[88.731, 82.75, 111.58]} rotation={[-Math.PI / 2, 0.034, 0]} scale={100} />
      <mesh geometry={nodes.Pillow_2_Pillow_0.geometry} material={materials.Pillow} position={[-79.089, 82.75, 111.58]} rotation={[-Math.PI / 2, -0.057, 0]} scale={100} />
      <mesh geometry={nodes.Floor_Floor_0.geometry} material={materials.Floor} rotation={[-Math.PI / 2, 0, 0]} scale={100} userData={{ ignoreCollision: true }}/>
      <mesh geometry={nodes._Curtain_1_Curtain_0.geometry} material={materials.Curtain} position={[590.872, 264.771, -299.977]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
      <mesh geometry={nodes.Curtain_bar_1__0.geometry} material={materials.Curtain_bar_1__0} position={[602.258, 368.015, -298.759]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
      <mesh geometry={nodes.Curtain_holders_1_Curtain_holders_0.geometry} material={materials.Curtain_holders} position={[590.056, 366.315, -387.131]} rotation={[0, 0, Math.PI / 2]} scale={5.086} />
      <mesh geometry={nodes.Curtain__2_Curtain_0.geometry} material={materials.Curtain} position={[-82.136, 264.771, -585.281]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100} />
      <mesh geometry={nodes.Curtain_bar_2__0.geometry} material={materials.Curtain_bar_1__0} position={[-80.917, 368.015, -596.667]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} scale={100} />
      <mesh geometry={nodes.Curtain_holders_2_Curtain_holders_0.geometry} material={materials.Curtain_holders} position={[-169.29, 366.315, -584.465]} rotation={[Math.PI / 2, Math.PI / 2, 0]} scale={5.086} />
      <mesh geometry={nodes.Table_Table_0.geometry} material={materials.Table} position={[449.413, 104.88, -540.466]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
      <mesh geometry={nodes.Table_legs_Table_legs_0.geometry} material={materials.Table_legs} position={[449.413, 83.941, -540.466]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
      <mesh geometry={nodes.Laptop_Laptop_0.geometry} material={materials.Laptop} position={[452.573, 123.115, -558.636]} rotation={[-Math.PI / 2, 0, -0.522]} scale={100} />
      <mesh geometry={nodes.Laptop_screen_Laptop_screen_0.geometry} material={materials.Laptop_screen} position={[452.573, 123.115, -558.636]} rotation={[-Math.PI / 2, 0, -0.522]} scale={100} />
      <mesh geometry={nodes.Laptop_keyboard_Laptop_keyboard_0.geometry} material={materials.Laptop_keyboard} position={[443.094, 109.443, -542.154]} rotation={[-Math.PI / 2, 0, -0.522]} scale={100} />
    </group>
  )
});

useGLTF.preload('./models/sample1/scene.gltf')
