import React, { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

const GridHelperComponent = ({ visible, color, position }) => {
  const { scene } = useThree();

  useEffect(() => {
    // Create a new GridHelper with appropriate size
    const gridHelper = new THREE.GridHelper(10, 10, color, color); // Adjust size and divisions as needed
    gridHelper.position.set(position.x, position.y, position.z);
    gridHelper.visible = visible;

    // Add to the scene
    scene.add(gridHelper);

    // Cleanup on unmount
    return () => {
      scene.remove(gridHelper);
    };
  }, [scene, color, position, visible]);

  useEffect(() => {
    // Update existing grid helper properties if they change
    const gridHelper = scene.children.find(child => child instanceof THREE.GridHelper);
    if (gridHelper) {
      gridHelper.visible = visible;
      gridHelper.material.color.set(color);
      gridHelper.position.set(position.x, position.y, position.z);
    }
  }, [scene, color, position, visible]);

  return null;
};

export default GridHelperComponent;
