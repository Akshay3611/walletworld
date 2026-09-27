import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useWalletStore } from '../store/walletStore';
import type { ScreenType } from '../types';

interface CameraPreset {
  position: THREE.Vector3;
  target: THREE.Vector3;
}

const PRESETS: Record<ScreenType, CameraPreset> = {
  dashboard: {
    position: new THREE.Vector3(0, 2.4, 4.8),
    target: new THREE.Vector3(0, 1.4, -2.5),
  },
  shop: {
    position: new THREE.Vector3(0, 2.4, 5.8),
    target: new THREE.Vector3(0, 1.3, 0),
  },
  garage: {
    position: new THREE.Vector3(0, 2.8, 7.5),
    target: new THREE.Vector3(0, 1.0, 0),
  },
  home: {
    position: new THREE.Vector3(0, 3.8, 8.5),
    target: new THREE.Vector3(0, 1.4, 0),
  },
  avatar: {
    position: new THREE.Vector3(0, 1.6, 3.6),
    target: new THREE.Vector3(0, 1.25, 0),
  },
  wallet: {
    position: new THREE.Vector3(0, 2.6, 5.2),
    target: new THREE.Vector3(0, 1.2, 0),
  },
  categories: {
    position: new THREE.Vector3(0, 3.0, 6.2),
    target: new THREE.Vector3(0, 1.0, 0),
  },
};

export const CameraController: React.FC = () => {
  const { camera } = useThree();
  const activeScreen = useWalletStore(s => s.activeScreen);
  const isInspecting = useWalletStore(s => s.isInspecting);

  const currentTarget = useRef(new THREE.Vector3(0, 1.4, -2.5));

  useFrame(({ pointer }, delta) => {
    // Select base preset
    const preset = PRESETS[activeScreen] || PRESETS.dashboard;

    // Mouse parallax offset (subtle, smooth, premium)
    const parallaxX = pointer.x * 0.45;
    const parallaxY = pointer.y * 0.25;

    // Calculate desired camera position
    const desiredPos = preset.position.clone();
    desiredPos.x += parallaxX;
    desiredPos.y += parallaxY;

    // If inspecting an item in shop/garage, dolly in slightly
    if (isInspecting) {
      desiredPos.z = Math.max(2.8, desiredPos.z - 1.2);
      desiredPos.y = 1.6;
    }

    // Smooth lerp camera position
    const lerpSpeed = Math.min(1, delta * 3.5);
    camera.position.lerp(desiredPos, lerpSpeed);

    // Smooth lerp target
    const desiredTarget = preset.target.clone();
    desiredTarget.x += parallaxX * 0.2;
    currentTarget.current.lerp(desiredTarget, lerpSpeed);
    camera.lookAt(currentTarget.current);
  });

  return null;
};
