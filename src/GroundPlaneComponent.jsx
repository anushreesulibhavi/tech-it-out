import React from 'react';
import { extend } from '@react-three/fiber';
import { PlaneGeometry, ShadowMaterial, Mesh } from 'three';

extend({ PlaneGeometry, ShadowMaterial, Mesh });

const GroundPlaneComponent = () => {
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
      <planeGeometry args={[10, 10]} />
      <shadowMaterial opacity={0.5} />
    </mesh>
  );

};

export default GroundPlaneComponent;
