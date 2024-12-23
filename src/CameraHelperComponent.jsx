import React, { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { CameraHelper, PerspectiveCamera, OrthographicCamera } from 'three';

const CameraHelperComponent = ({ cameraType }) => {
  const { scene } = useThree();
  const cameraRef = useRef();
  const helperRef = useRef();

  useEffect(() => {
    if (cameraRef.current && helperRef.current) {
      scene.remove(cameraRef.current);
      scene.remove(helperRef.current);
    }

    if (cameraType === 'perspective') {
      cameraRef.current = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    } else if (cameraType === 'orthographic') {
      const frustumSize = 5;
      const aspect = window.innerWidth / window.innerHeight;
      cameraRef.current = new OrthographicCamera(frustumSize * aspect / -2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / -2, 0.1, 1000);
    }

    cameraRef.current.position.set(10, 10, 10);
    cameraRef.current.lookAt(0, 0, 0);
    scene.add(cameraRef.current);

    helperRef.current = new CameraHelper(cameraRef.current);
    scene.add(helperRef.current);

    return () => {
      if (cameraRef.current && helperRef.current) {
        scene.remove(cameraRef.current);
        scene.remove(helperRef.current);
      }
    };
  }, [scene, cameraType]);

  return null;
};

export default CameraHelperComponent;

