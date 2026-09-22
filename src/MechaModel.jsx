import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import { createHologramMaterial } from './HologramMaterial';

/* ── Main Model ── */
export function MechaModel({ wireframe = false, hologram = false, ...props }) {
  const group = useRef();
  const { scene } = useGLTF('/Untitled.glb');

  const originalMaterials = useRef(new Map());
  const initialized = useRef(false);
  const hologramMat = useMemo(() => createHologramMaterial('#00e5ff'), []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    scene.traverse((child) => {
      if (child.isMesh) {
        originalMaterials.current.set(child.uuid, child.material);
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        if (hologram) {
          child.material = hologramMat;
        } else {
          const orig = originalMaterials.current.get(child.uuid);
          if (orig) {
            child.material = orig;
            child.material.wireframe = wireframe;
            child.material.envMapIntensity = 1.8;
            child.material.needsUpdate = true;
          }
        }
      }
    });
  }, [scene, hologram, wireframe, hologramMat]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (hologram) hologramMat.uniforms.uTime.value = t;
    if (group.current) {
      group.current.position.y = Math.sin(t * 1.2) * 0.05;
    }
  });

  return (
    <Center>
      <group ref={group} {...props} dispose={null}>
        <primitive object={scene} scale={2.5} />
        </group>
    </Center>
  );
}

useGLTF.preload('/Untitled.glb');
