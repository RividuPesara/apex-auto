import { useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows, Html, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import './CarModelViewer.css';

function LoadingScreen() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="viewer-loading">
        <div className="viewer-loading-spinner"></div>
        <p className="viewer-loading-text">Loading 3D Model</p>
        <div className="viewer-loading-bar-bg">
          <div className="viewer-loading-bar" style={{ width: `${progress}%` }}></div>
        </div>
        <span className="viewer-loading-pct">{Math.round(progress)}%</span>
      </div>
    </Html>
  );
}

function CarModel({ color, onLoaded }) {
  const { scene } = useGLTF('/models/porshe.glb');
  const modelRef = useRef();

  useEffect(() => {
    if (scene && onLoaded) onLoaded();
  }, [scene, onLoaded]);

  // Apply color to car body parts while keeping glass/chrome/tires same
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        if (!child.userData.originalMaterial) {
          child.userData.originalMaterial = child.material.clone();
          child.material = child.material.clone();
        }

        const matName = (child.material.name || '').toLowerCase();
        const meshName = (child.name || '').toLowerCase();

        const isExcluded =
          matName.includes('glass') ||
          matName.includes('window') ||
          matName.includes('tire') ||
          matName.includes('rubber') ||
          matName.includes('chrome') ||
          matName.includes('metal') ||
          matName.includes('light') ||
          matName.includes('lens') ||
          matName.includes('rim') ||
          matName.includes('wheel') ||
          matName.includes('interior') ||
          meshName.includes('glass') ||
          meshName.includes('window') ||
          meshName.includes('tire') ||
          meshName.includes('wheel') ||
          meshName.includes('light') ||
          meshName.includes('rim');

        if (!isExcluded) {
          child.material.color.set(color);
        }
      }
    });
  }, [color, scene]);

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={1}
      position={[0, 0, 0]}
    />
  );
}

useGLTF.preload('/models/porshe.glb');

export default function CarModelViewer({ color = '#FF6B35', onLoaded }) {
  return (
    <div className="car-viewer-container">
      <Canvas
        camera={{ position: [4, 2, 5], fov: 45 }}
        shadows
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
        <directionalLight position={[-5, 5, -5]} intensity={0.4} />

        <Suspense fallback={<LoadingScreen />}>
          <CarModel color={color} onLoaded={onLoaded} />
          <Environment preset="city" />
          <ContactShadows
            position={[0, -0.5, 0]}
            opacity={0.5}
            scale={10}
            blur={2}
            far={4}
          />
        </Suspense>

        <OrbitControls
          enablePan={false}
          minDistance={3}
          maxDistance={10}
          minPolarAngle={0.2}
          maxPolarAngle={Math.PI / 2.1}
          target={[0, 0.5, 0]}
        />
      </Canvas>

      <div className="viewer-hint">Drag to rotate &bull; Scroll to zoom</div>
    </div>
  );
}
