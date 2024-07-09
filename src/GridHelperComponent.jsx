import React from "react";
import { useThree } from "@react-three/fiber";
import { GridHelper } from "three";

const GridHelperComponent = ({ gridColor }) => {
  const { scene } = useThree();

  React.useEffect(() => {
    const gridHelper = new GridHelper(10, 10, gridColor, gridColor);
    scene.add(gridHelper);

    return () => {
      scene.remove(gridHelper);
    };
  }, [scene, gridColor]);

  return null;
};

export default GridHelperComponent;