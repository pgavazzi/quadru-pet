import { useMemo, useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Group, Quaternion, Vector3 } from 'three';
import { DEG, LEGS } from '../model/skeleton';
import { BODY_PIVOT } from '../model/gaits';
import { useStore } from '../store';
import { mats } from './materials';
import { DogBody } from './DogBody';
import { LegRig } from './LegRig';

/** Cylinder spanning two points — used for the rail-to-leg mount struts. */
function Bar({ from, to, r }: { from: [number, number, number]; to: [number, number, number]; r: number }) {
  const { mid, quat, len } = useMemo(() => {
    const v0 = new Vector3(...from);
    const v1 = new Vector3(...to);
    const dir = v1.clone().sub(v0);
    return {
      len: dir.length(),
      mid: v0.clone().add(v1).multiplyScalar(0.5),
      quat: new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), dir.normalize()),
    };
  }, [from, to, r]);
  return (
    <mesh material={mats.carbon} position={mid} quaternion={quat} castShadow>
      <cylinderGeometry args={[r, r, len, 10]} />
    </mesh>
  );
}

function Spine() {
  const select = useStore((s) => s.select);
  const exploded = useStore((s) => s.view.exploded);
  const pick = (id: string) => (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    select(id);
  };

  return (
    <group>
      {/* segmented dorsal rail */}
      <group position-y={exploded * 0.2} onClick={pick('spine_rail')}>
        {[-0.24, -0.08, 0.08, 0.24].map((z) => (
          <mesh key={z} material={mats.carbon} position={[0, 0.595, z]} castShadow>
            <boxGeometry args={[0.085, 0.03, 0.13]} />
          </mesh>
        ))}
        {/* rail spine bus */}
        <mesh material={mats.darkMetal} position={[0, 0.612, 0]}>
          <boxGeometry args={[0.024, 0.012, 0.62]} />
        </mesh>
      </group>

      {/* battery pack */}
      <group position-y={exploded * 0.34} onClick={pick('battery')}>
        <mesh material={mats.darkMetal} position={[0, 0.652, -0.17]} castShadow>
          <boxGeometry args={[0.11, 0.055, 0.18]} />
        </mesh>
        <mesh material={mats.led} position={[0, 0.655, -0.078]}>
          <boxGeometry args={[0.07, 0.012, 0.004]} />
        </mesh>
        {/* vents */}
        {[-0.21, -0.17, -0.13].map((z) => (
          <mesh key={z} material={mats.aluminum} position={[0, 0.682, z]}>
            <boxGeometry args={[0.09, 0.004, 0.012]} />
          </mesh>
        ))}
      </group>

      {/* gait controller pod + antenna */}
      <group position-y={exploded * 0.28} onClick={pick('controller')}>
        <mesh material={mats.aluminum} position={[0, 0.64, 0.16]} castShadow>
          <boxGeometry args={[0.08, 0.04, 0.1]} />
        </mesh>
        <mesh material={mats.rubber} position={[0.03, 0.685, 0.13]}>
          <cylinderGeometry args={[0.0035, 0.002, 0.055, 6]} />
        </mesh>
      </group>

      {/* harness straps wrapping the torso */}
      <group onClick={pick('harness_front')} position-y={exploded * 0.1}>
        <mesh material={mats.strap} position={[0, 0.445, 0.17]} castShadow>
          <torusGeometry args={[0.148, 0.013, 10, 40]} />
        </mesh>
      </group>
      <group onClick={pick('harness_rear')} position-y={exploded * 0.1}>
        <mesh material={mats.strap} position={[0, 0.45, -0.1]} castShadow>
          <torusGeometry args={[0.142, 0.013, 10, 40]} />
        </mesh>
      </group>

      {/* rail → leg-mount struts */}
      {LEGS.map((l) => (
        <Bar
          key={l.id}
          from={[l.side * 0.04, 0.585, l.mount[2]]}
          to={[l.mount[0] * (1 + exploded * 0.35), l.mount[1] + 0.01, l.mount[2]]}
          r={0.009}
        />
      ))}
    </group>
  );
}

/** Full model with turntable + gait body pose applied transiently each frame. */
export function ExoModel() {
  const turn = useRef<Group>(null);
  const lift = useRef<Group>(null);
  const pitch = useRef<Group>(null);

  useFrame((_, dt) => {
    const { body, view } = useStore.getState();
    if (turn.current && view.turntable) turn.current.rotation.y += dt * 0.4;
    if (lift.current) lift.current.position.y = body.lift;
    if (pitch.current) pitch.current.rotation.x = body.pitch * DEG;
  });

  return (
    <group ref={turn}>
      <group ref={lift}>
        <group position={BODY_PIVOT}>
          <group ref={pitch}>
            <group position={[-BODY_PIVOT[0], -BODY_PIVOT[1], -BODY_PIVOT[2]]}>
              <DogBody />
              <Spine />
              {LEGS.map((l) => (
                <LegRig key={l.id} leg={l} />
              ))}
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}
