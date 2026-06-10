import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { DEG, type JointDef, type LegDef } from '../model/skeleton';
import { useStore } from '../store';
import { Actuator } from './Actuator';
import { mats } from './materials';

/** Exoskeleton side plates + the dog's own limb flesh for one segment. */
function Segment({ joint, side }: { joint: JointDef; side: 1 | -1 }) {
  const L = joint.segmentLength;
  const plateOffset = joint.fleshRadius + 0.009;
  return (
    <group>
      {/* dog limb inside the frame */}
      <mesh material={mats.dog} position-y={-L / 2} castShadow>
        <capsuleGeometry args={[joint.fleshRadius, L * 0.85, 6, 14]} />
      </mesh>
      {/* twin carbon side plates */}
      {[1, -1].map((p) => (
        <mesh key={p} material={mats.carbon} position={[p * plateOffset * 0.4 + side * plateOffset * 0.6, -L / 2, p * plateOffset]} castShadow>
          <boxGeometry args={[0.007, L * 0.92, 0.016]} />
        </mesh>
      ))}
      {/* mid cross brace */}
      <mesh material={mats.darkMetal} position={[side * plateOffset * 0.6, -L * 0.55, 0]}>
        <boxGeometry args={[0.008, 0.012, plateOffset * 2 + 0.014]} />
      </mesh>
      {/* cable conduit */}
      <mesh material={mats.rubber} position={[side * (plateOffset + 0.006), -L / 2, -plateOffset * 0.4]}>
        <cylinderGeometry args={[0.004, 0.004, L * 0.9, 8]} />
      </mesh>
    </group>
  );
}

function Paw({ joint }: { joint: JointDef }) {
  return (
    <mesh material={mats.dogDark} position-y={-joint.segmentLength} scale={[1, 0.62, 1.35]} castShadow>
      <sphereGeometry args={[joint.fleshRadius + 0.013, 14, 12]} />
    </mesh>
  );
}

/**
 * Kinematic chain of 3 actuated joints. Rotations are applied transiently in
 * useFrame (not via React re-renders) so 60 fps gait playback stays cheap.
 */
export function LegRig({ leg }: { leg: LegDef }) {
  const j0 = useRef<Group>(null);
  const j1 = useRef<Group>(null);
  const j2 = useRef<Group>(null);
  const exploded = useStore((s) => s.view.exploded);
  const [a, b, c] = leg.joints;

  useFrame(() => {
    const angles = useStore.getState().angles;
    if (j0.current) j0.current.rotation.x = angles[a.id] * DEG;
    if (j1.current) j1.current.rotation.x = angles[b.id] * DEG;
    if (j2.current) j2.current.rotation.x = angles[c.id] * DEG;
  });

  // Exploded view pushes each joint level outward from the body
  const ex = (level: number): [number, number, number] => [leg.side * exploded * (0.05 + level * 0.045), 0, 0];

  return (
    <group position={leg.mount}>
      <group position={ex(0)}>
        <group ref={j0}>
          <Actuator joint={a} side={leg.side} />
          <Segment joint={a} side={leg.side} />
          <group position={[0, -a.segmentLength, 0]}>
            <group position={ex(1)}>
              <group ref={j1}>
                <Actuator joint={b} side={leg.side} />
                <Segment joint={b} side={leg.side} />
                <group position={[0, -b.segmentLength, 0]}>
                  <group position={ex(2)}>
                    <group ref={j2}>
                      <Actuator joint={c} side={leg.side} />
                      <Segment joint={c} side={leg.side} />
                      <Paw joint={c} />
                    </group>
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}
