'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const CAMERA_Z = 4.8;
const CAMERA_FOV = 40;
const DESIRED_SIZE = 1.65;

export interface PenScene3DHandle {
  update: (active: boolean, progress: number) => void;
}

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const smoothstep = (value: number) => {
  const x = clamp01(value);
  return x * x * (3 - 2 * x);
};

function disposeMaterial(material: THREE.Material) {
  for (const value of Object.values(material)) {
    if (value instanceof THREE.Texture) value.dispose();
  }
  material.dispose();
}

const PenScene3D = forwardRef<PenScene3DHandle>(function PenScene3D(_, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const readyRef = useRef(false);
  const lastRef = useRef({ active: false, progress: 0 });

  const renderProgress = (active: boolean, progress: number) => {
    const container = containerRef.current;
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const group = groupRef.current;
    if (!container) return;

    container.style.opacity = active ? '1' : '0';
    if (!active || !renderer || !scene || !camera || !group || !readyRef.current) return;

    const entry = smoothstep(progress / (0.08 / 0.18));
    const drawing = smoothstep((progress - 0.08 / 0.18) / (0.06 / 0.18));
    const returnT = smoothstep((progress - 0.14 / 0.18) / (0.04 / 0.18));

    if (progress < 0.08 / 0.18) {
      group.position.x = THREE.MathUtils.lerp(2.55, 0.92, entry);
      group.position.y = THREE.MathUtils.lerp(0.12, -0.08, entry);
    } else if (progress < 0.14 / 0.18) {
      group.position.x = THREE.MathUtils.lerp(0.92, 0.08, drawing);
      group.position.y = THREE.MathUtils.lerp(-0.08, -0.28, drawing);
    } else {
      group.position.x = THREE.MathUtils.lerp(0.08, 1.02, returnT);
      group.position.y = THREE.MathUtils.lerp(-0.28, -0.02, returnT);
    }

    group.position.z = 0;
    group.rotation.z = THREE.MathUtils.lerp(0, Math.PI / 2, returnT);
    renderer.render(scene, camera);
  };

  useImperativeHandle(ref, () => ({
    update(active, progress) {
      lastRef.current = { active, progress };
      renderProgress(active, progress);
    },
  }));

  useEffect(() => {
    const container = containerRef.current;
    if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let disposed = false;
    let renderer: THREE.WebGLRenderer;

    try {
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x050510, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(CAMERA_FOV, width / height, 0.1, 50);
      camera.position.set(0, 0, CAMERA_Z);
      camera.fov = CAMERA_FOV;
      camera.updateProjectionMatrix();
      sceneRef.current = scene;
      cameraRef.current = camera;

      scene.add(new THREE.AmbientLight(0xffffff, 0.7));
      const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
      keyLight.position.set(3, 6, 4);
      scene.add(keyLight);
      const fillLight = new THREE.DirectionalLight(0xa0a0ff, 0.42);
      fillLight.position.set(-4, -2, 2);
      scene.add(fillLight);

      const group = new THREE.Group();
      scene.add(group);
      groupRef.current = group;

      new GLTFLoader().load(
        '/assets/home-story/pen.glb',
        (gltf) => {
          if (disposed) return;
          const model = gltf.scene;
          const box = new THREE.Box3().setFromObject(model);
          const size = new THREE.Vector3();
          const center = new THREE.Vector3();
          box.getSize(size);
          box.getCenter(center);
          model.position.sub(center);
          const longest = Math.max(size.x, size.y, size.z);
          if (longest > 0) model.scale.setScalar(DESIRED_SIZE / longest);
          group.add(model);
          readyRef.current = true;
          renderProgress(lastRef.current.active, lastRef.current.progress);
        },
        undefined,
        (error) => console.warn('[PenScene3D] pen.glb load failed:', error),
      );

      const onResize = () => {
        const nextWidth = container.clientWidth || window.innerWidth;
        const nextHeight = container.clientHeight || window.innerHeight;
        camera.aspect = nextWidth / nextHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(nextWidth, nextHeight);
        renderProgress(lastRef.current.active, lastRef.current.progress);
      };

      window.addEventListener('resize', onResize);
      return () => {
        disposed = true;
        window.removeEventListener('resize', onResize);
        scene.traverse((object) => {
          if (!(object instanceof THREE.Mesh)) return;
          object.geometry?.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(disposeMaterial);
          } else {
            disposeMaterial(object.material);
          }
        });
        renderer.renderLists.dispose();
        renderer.dispose();
        if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
        rendererRef.current = null;
        sceneRef.current = null;
        cameraRef.current = null;
        groupRef.current = null;
        readyRef.current = false;
      };
    } catch (error) {
      console.warn('[PenScene3D] Three.js init failed:', error);
    }
  }, []);

  return <div ref={containerRef} className="ick-pen-layer" aria-hidden="true" />;
});

export default PenScene3D;
