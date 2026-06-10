import { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  GizmoHelper,
  GizmoViewport,
  Grid,
  Lightformer,
  OrbitControls,
} from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { JOINTS, type JointId } from '../model/skeleton';
import { sampleBodyPose, sampleGait } from '../model/gaits';
import { useStore } from '../store';
import { setDogOpacity, setLedColor, setWireframe } from './materials';
import { ExoModel } from './Exoskeleton';

/** Eases joint angles + body pose toward the active gait's targets each frame. */
function GaitDriver() {
  const t = useRef(0);
  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const s = useStore.getState();
    const k = 1 - Math.exp(-dt * 7);
    if (s.playing) {
      t.current += dt;
      const next = {} as Record<JointId, number>;
      for (const j of JOINTS) {
        const target = sampleGait(s.gait, t.current, j);
        next[j.id] = s.angles[j.id] + (target - s.angles[j.id]) * k;
      }
      s.setAngles(next);
      const bp = sampleBodyPose(s.gait, t.current);
      s.setBody(
        s.body.pitch + (bp.pitch - s.body.pitch) * k,
        s.body.lift + (bp.lift - s.body.lift) * k,
      );
    } else if (Math.abs(s.body.pitch) > 0.01 || Math.abs(s.body.lift) > 0.0005) {
      // relax body pose back to neutral after pausing
      s.setBody(s.body.pitch * (1 - k), s.body.lift * (1 - k));
    }
  });
  return null;
}

/** Applies UI view options to the shared materials. */
function ViewController() {
  const { wireframe, ledColor, bodyOpacity } = useStore((s) => s.view);
  useEffect(() => setWireframe(wireframe), [wireframe]);
  useEffect(() => setLedColor(ledColor), [ledColor]);
  useEffect(() => setDogOpacity(bodyOpacity), [bodyOpacity]);
  return null;
}

export function Viewport() {
  const select = useStore((s) => s.select);
  return (
    <Canvas
      shadows="percentage"
      dpr={[1, 2]}
      camera={{ position: [1.5, 0.85, 1.7], fov: 38 }}
      onPointerMissed={() => select(null)}
    >
      <color attach="background" args={['#e9ebef']} />
      <fog attach="fog" args={['#e9ebef', 7, 16]} />

      <hemisphereLight intensity={0.45} groundColor="#b8bcc4" />
      <directionalLight
        position={[3, 5, 2.5]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-1.5}
        shadow-camera-right={1.5}
        shadow-camera-top={1.5}
        shadow-camera-bottom={-1.5}
      />
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={1.1} rotation-x={Math.PI / 2} position={[0, 4, 0]} scale={[8, 8, 1]} />
        <Lightformer intensity={0.7} rotation-y={Math.PI / 2} position={[-4, 1.5, 0]} scale={[6, 2, 1]} color="#dcebff" />
        <Lightformer intensity={0.5} rotation-y={-Math.PI / 2} position={[4, 1.5, 0]} scale={[6, 2, 1]} />
      </Environment>

      <ExoModel />

      <ContactShadows position={[0, 0.001, 0]} opacity={0.45} scale={4} blur={2.2} far={1.2} resolution={512} />
      <Grid
        args={[10, 10]}
        cellSize={0.2}
        cellColor="#cdd1d8"
        sectionSize={1}
        sectionColor="#b3b9c2"
        fadeDistance={8}
        infiniteGrid
      />

      <OrbitControls
        makeDefault
        enableDamping
        target={[0, 0.38, 0]}
        minDistance={0.6}
        maxDistance={6}
        maxPolarAngle={Math.PI * 0.55}
      />
      <GizmoHelper alignment="bottom-right" margin={[64, 64]}>
        <GizmoViewport axisColors={['#e2654f', '#7ab648', '#5689d8']} labelColor="#1c2026" />
      </GizmoHelper>

      <EffectComposer multisampling={4}>
        <Bloom mipmapBlur luminanceThreshold={1} intensity={0.85} />
      </EffectComposer>

      <GaitDriver />
      <ViewController />
    </Canvas>
  );
}
