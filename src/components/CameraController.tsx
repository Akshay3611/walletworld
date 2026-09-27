import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useWalletStore } from '../store/walletStore';
import { useWorldStore } from '../store/worldStore';
import type { ScreenType } from '../types';

interface CameraPreset {
  position: THREE.Vector3;
  target: THREE.Vector3;
}

const SCREEN_PRESETS: Record<ScreenType, CameraPreset> = {
  dashboard: {
    position: new THREE.Vector3(0, 2.3, 4.6),
    target: new THREE.Vector3(0, 1.3, -2.4),
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

const OBJECT_PRESETS: Record<string, CameraPreset> = {
  'prod-macbookpro': {
    position: new THREE.Vector3(-2.3, 1.42, -1.7),
    target: new THREE.Vector3(-2.8, 1.15, -2.35),
  },
  'prod-smartwatch': {
    position: new THREE.Vector3(-1.3, 1.38, -1.65),
    target: new THREE.Vector3(-1.75, 1.18, -2.15),
  },
  'prod-sony-wh1000xm6': {
    position: new THREE.Vector3(-2.9, 1.45, -1.8),
    target: new THREE.Vector3(-3.45, 1.25, -2.45),
  },
  avatar: {
    position: new THREE.Vector3(-0.4, 1.5, -1.4),
    target: new THREE.Vector3(-0.4, 1.35, -2.8),
  },
};

export const CameraController: React.FC = () => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  const activeScreen = useWalletStore((s) => s.activeScreen);
  const selectedProductId = useWalletStore((s) => s.selectedProductId);
  const cameraFocus = useWorldStore((s) => s.cameraFocus);

  // Desired target & position state
  const targetPos = useRef(new THREE.Vector3(0, 2.3, 4.6));
  const targetLook = useRef(new THREE.Vector3(0, 1.3, -2.4));
  const isTransitioning = useRef(true);

  // Update target coordinates when screen, object, or focus changes
  useEffect(() => {
    isTransitioning.current = true;

    if (activeScreen === 'dashboard') {
      if (selectedProductId && OBJECT_PRESETS[selectedProductId]) {
        targetPos.current.copy(OBJECT_PRESETS[selectedProductId].position);
        targetLook.current.copy(OBJECT_PRESETS[selectedProductId].target);
      } else if (cameraFocus) {
        targetPos.current.set(...cameraFocus.position);
        targetLook.current.set(...cameraFocus.target);
      } else {
        const base = SCREEN_PRESETS.dashboard;
        targetPos.current.copy(base.position);
        targetLook.current.copy(base.target);
      }
    } else {
      const base = SCREEN_PRESETS[activeScreen] || SCREEN_PRESETS.dashboard;
      targetPos.current.copy(base.position);
      targetLook.current.copy(base.target);
    }
  }, [activeScreen, selectedProductId, cameraFocus]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    if (isTransitioning.current) {
      const lerpFactor = Math.min(1, delta * 3.8);

      // Lerp camera position
      camera.position.lerp(targetPos.current, lerpFactor);

      // Lerp controls target
      controlsRef.current.target.lerp(targetLook.current, lerpFactor);
      controlsRef.current.update();

      // Check if settled
      if (
        camera.position.distanceTo(targetPos.current) < 0.05 &&
        controlsRef.current.target.distanceTo(targetLook.current) < 0.05
      ) {
        isTransitioning.current = false;
      }
    }
  });

  const isInspectingInApartment = activeScreen === 'dashboard' && Boolean(selectedProductId);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.06}
      rotateSpeed={0.65}
      zoomSpeed={0.7}
      panSpeed={0.5}
      enablePan={!isInspectingInApartment}
      minDistance={isInspectingInApartment ? 0.6 : 2.2}
      maxDistance={isInspectingInApartment ? 3.0 : 7.2}
      minPolarAngle={Math.PI / 5}
      maxPolarAngle={Math.PI / 2.05}
      minAzimuthAngle={activeScreen === 'dashboard' ? -Math.PI / 3.2 : undefined}
      maxAzimuthAngle={activeScreen === 'dashboard' ? Math.PI / 3.2 : undefined}
      onStart={() => {
        // User manually interacted with OrbitControls, pause auto-lerp
        isTransitioning.current = false;
      }}
    />
  );
};
