import { useMemo } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import type { JointDef } from '../model/skeleton';
import { useStore } from '../store';
import { mats } from './materials';

/**
 * One motor pod: housing cylinder on the joint X axis, rotor cap and bolt ring
 * on the outboard face, heat-sink ridges and an emissive status LED ring.
 */
export function Actuator({ joint, side }: { joint: JointDef; side: 1 | -1 }) {
  const r = joint.housingRadius;
  const w = r * 1.5; // housing width along the axis
  const selected = useStore((s) => s.selection === joint.id);
  const select = useStore((s) => s.select);
  const ledColor = useStore((s) => s.view.ledColor);

  const bolts = useMemo(() => {
    const out: [number, number][] = [];
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      out.push([Math.cos(a) * r * 0.55, Math.sin(a) * r * 0.55]);
    }
    return out;
  }, [r]);

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    select(joint.id);
  };

  const face = side * (w / 2); // outboard face x position

  return (
    <group onClick={onClick}>
      {/* housing */}
      <mesh material={mats.aluminum} rotation-z={Math.PI / 2} castShadow>
        <cylinderGeometry args={[r, r, w, 28]} />
      </mesh>
      {/* heat-sink ridges */}
      {[-0.25, 0.05].map((o) => (
        <mesh key={o} material={mats.darkMetal} rotation-z={Math.PI / 2} position-x={side * w * o}>
          <cylinderGeometry args={[r * 1.04, r * 1.04, w * 0.12, 28]} />
        </mesh>
      ))}
      {/* rotor cap */}
      <mesh material={mats.darkMetal} rotation-z={Math.PI / 2} position-x={face + side * r * 0.08} castShadow>
        <cylinderGeometry args={[r * 0.62, r * 0.62, r * 0.18, 24]} />
      </mesh>
      {/* bolt ring on the rotor */}
      {bolts.map(([y, z], i) => (
        <mesh key={i} material={mats.aluminum} rotation-z={Math.PI / 2} position={[face + side * r * 0.17, y, z]}>
          <cylinderGeometry args={[r * 0.07, r * 0.07, r * 0.1, 8]} />
        </mesh>
      ))}
      {/* status LED ring */}
      <mesh material={mats.led} rotation-y={Math.PI / 2} position-x={face + side * 0.001}>
        <torusGeometry args={[r * 0.78, r * 0.05, 10, 36]} />
      </mesh>
      {/* selection glow shell */}
      {selected && (
        <mesh rotation-z={Math.PI / 2} scale={1.12}>
          <cylinderGeometry args={[r, r, w, 28]} />
          <meshBasicMaterial color={ledColor} transparent opacity={0.35} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}
