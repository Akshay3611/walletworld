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
  minDist: number;
  maxDist: number;
}

// Room overview composition: medium-wide, balanced framing showing desk, bed, window, and floor
const DEFAULT_ROOM_PRESET: CameraPreset = {
  position: new THREE.Vector3(0, 2.35, 3.8),
  target: new THREE.Vector3(0, 1.3, -2.4),
  minDist: 4.8,
  maxDist: 6.8,
};

const SCREEN_PRESETS: Record<ScreenType, CameraPreset> = {
  dashboard: DEFAULT_ROOM_PRESET,
  shop: {
    position: new THREE.Vector3(0, 2.4, 5.8),
    target: new THREE.Vector3(0, 1.3, 0),
    minDist: 3.5,
    maxDist: 7.5,
  },
  garage: {
    position: new THREE.Vector3(0, 2.8, 7.5),
    target: new THREE.Vector3(0, 1.0, 0),
    minDist: 4.0,
    maxDist: 9.0,
  },
  home: {
    position: new THREE.Vector3(0, 3.8, 8.5),
    target: new THREE.Vector3(0, 1.4, 0),
    minDist: 4.5,
    maxDist: 10.0,
  },
  avatar: {
    position: new THREE.Vector3(0, 1.6, 3.6),
    target: new THREE.Vector3(0, 1.25, 0),
    minDist: 2.2,
    maxDist: 4.5,
  },
  wallet: {
    position: new THREE.Vector3(0, 2.6, 5.2),
    target: new THREE.Vector3(0, 1.2, 0),
    minDist: 3.0,
    maxDist: 6.5,
  },
  categories: {
    position: new THREE.Vector3(0, 3.0, 6.2),
    target: new THREE.Vector3(0, 1.0, 0),
    minDist: 3.5,
    maxDist: 7.5,
  },
};

const OBJECT_INSPECTION_PRESETS: Record<string, CameraPreset> = {
  'prod-macbookpro': {
    position: new THREE.Vector3(-2.35, 1.45, -1.8),
    target: new THREE.Vector3(-2.8, 1.15, -2.35),
    minDist: 0.65,
    maxDist: 1.5,
  },
  'prod-smartwatch': {
    position: new THREE.Vector3(-1.4, 1.35, -1.75),
    target: new THREE.Vector3(-1.75, 1.18, -2.15),
    minDist: 0.5,
    maxDist: 1.2,
  },
  'prod-sony-wh1000xm6': {
    position: new THREE.Vector3(-3.0, 1.45, -1.9),
    target: new THREE.Vector3(-3.45, 1.25, -2.45),
    minDist: 0.6,
    maxDist: 1.4,
  },
  avatar: {
    position: new THREE.Vector3(-0.4, 1.5, -1.2),
    target: new THREE.Vector3(-0.4, 1.35, -2.8),
    minDist: 1.2,
    maxDist: 2.2,
  },
};

export const CameraController: React.FC = () => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  const activeScreen = useWalletStore((s) => s.activeScreen);
  const selectedProductId = useWalletStore((s) => s.selectedProductId);
  const cameraFocus = useWorldStore((s) => s.cameraFocus);
  const previousCameraPos = useWorldStore((s) => s.previousCameraPosition);
  const previousCameraTarget = useWorldStore((s) => s.previousCameraTarget);
  const saveCurrentCamera = useWorldStore((s) => s.saveCurrentCamera);
  const setHasInteracted = useWorldStore((s) => s.setHasInteracted);

  // Desired target & position state
  const targetPos = useRef(DEFAULT_ROOM_PRESET.position.clone());
  const targetLook = useRef(DEFAULT_ROOM_PRESET.target.clone());
  const isTransitioning = useRef(true);
  const wasInspecting = useRef(false);

  const isInspectingInApartment = activeScreen === 'dashboard' && Boolean(selectedProductId);

  // Update target coordinates when screen, object, or focus changes
  useEffect(() => {
    isTransitioning.current = true;

    if (activeScreen === 'dashboard') {
      if (selectedProductId && OBJECT_INSPECTION_PRESETS[selectedProductId]) {
        // We are entering inspection: save previous camera position if not already saved
        if (!wasInspecting.current && controlsRef.current) {
          saveCurrentCamera(
            [camera.position.x, camera.position.y, camera.position.z],
            [controlsRef.current.target.x, controlsRef.current.target.y, controlsRef.current.target.z]
          );
        }
        wasInspecting.current = true;

        const preset = OBJECT_INSPECTION_PRESETS[selectedProductId];
        targetPos.current.copy(preset.position);
        targetLook.current.copy(preset.target);
      } else if (cameraFocus) {
        targetPos.current.set(...cameraFocus.position);
        targetLook.current.set(...cameraFocus.target);
      } else {
        // Exiting inspection or returning to room: restore previous camera or default preset
        if (wasInspecting.current && previousCameraPos && previousCameraTarget) {
          targetPos.current.set(...previousCameraPos);
          targetLook.current.set(...previousCameraTarget);
        } else {
          targetPos.current.copy(DEFAULT_ROOM_PRESET.position);
          targetLook.current.copy(DEFAULT_ROOM_PRESET.target);
        }
        wasInspecting.current = false;
      }
    } else {
      wasInspecting.current = false;
      const base = SCREEN_PRESETS[activeScreen] || DEFAULT_ROOM_PRESET;
      targetPos.current.copy(base.position);
      targetLook.current.copy(base.target);
    }
  }, [activeScreen, selectedProductId, cameraFocus, previousCameraPos, previousCameraTarget, saveCurrentCamera, camera]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    if (isTransitioning.current) {
      // Smooth cinematic ease-out interpolation
      const lerpFactor = Math.min(1, delta * 3.6);

      camera.position.lerp(targetPos.current, lerpFactor);
      controlsRef.current.target.lerp(targetLook.current, lerpFactor);
      controlsRef.current.update();

      // Check if settled close enough
      if (
        camera.position.distanceTo(targetPos.current) < 0.04 &&
        controlsRef.current.target.distanceTo(targetLook.current) < 0.04
      ) {
        isTransitioning.current = false;
      }
    }
  });

  // Calculate current distance constraints
  const currentPreset =
    isInspectingInApartment && selectedProductId && OBJECT_INSPECTION_PRESETS[selectedProductId]
      ? OBJECT_INSPECTION_PRESETS[selectedProductId]
      : SCREEN_PRESETS[activeScreen] || DEFAULT_ROOM_PRESET;

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.05}
      rotateSpeed={0.55}
      zoomSpeed={0.55}
      panSpeed={0.4}
      enablePan={false} // Disable panning to keep the room perfectly composed
      minDistance={currentPreset.minDist}
      maxDistance={currentPreset.maxDist}
      // Strict vertical constraints: cannot flip upside-down, cannot look directly down, cannot penetrate floor
      minPolarAngle={isInspectingInApartment ? Math.PI / 4.5 : Math.PI / 4.2}
      maxPolarAngle={Math.PI / 2.22}
      // Strict horizontal azimuth constraints: cannot spin outside room walls
      minAzimuthAngle={isInspectingInApartment ? undefined : -Math.PI / 4.5}
      maxAzimuthAngle={isInspectingInApartment ? undefined : Math.PI / 4.5}
      onStart={() => {
        // User manually interacted, mark as interacted so tutorial hint fades out
        setHasInteracted(true);
        isTransitioning.current = false;
      }}
    />
  );
};
