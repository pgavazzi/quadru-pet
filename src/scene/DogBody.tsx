import { mats } from './materials';
import { useFitFactors, useStore } from '../store';
import type { ThreeEvent } from '@react-three/fiber';

/**
 * Stylized passive dog body. Limbs live inside LegRig so they articulate with
 * the exoskeleton; this is the torso, head, neck, tail and haunches.
 */
export function DogBody() {
  const select = useStore((s) => s.select);
  const { lengthF, girthF } = useFitFactors();
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    select('dog');
  };

  return (
    <group onClick={onClick}>
      {/* trunk: stretched by body length, thickened by chest girth.
          Centered at spine height so the scale doesn't shift it vertically. */}
      <group position={[0, 0.44, 0]} scale={[girthF, girthF, lengthF]}>
        {/* torso */}
        <mesh material={mats.dog} position={[0, 0, -0.01]} rotation-x={Math.PI / 2} castShadow>
          <capsuleGeometry args={[0.122, 0.38, 8, 20]} />
        </mesh>
        {/* chest */}
        <mesh material={mats.dog} position={[0, -0.01, 0.23]} castShadow>
          <sphereGeometry args={[0.128, 18, 14]} />
        </mesh>
        {/* haunches */}
        {[1, -1].map((s) => (
          <mesh key={s} material={mats.dog} position={[s * 0.08, -0.005, -0.245]} castShadow>
            <sphereGeometry args={[0.085, 16, 12]} />
          </mesh>
        ))}
        {/* tail */}
        <mesh material={mats.dogDark} position={[0, 0.09, -0.33]} rotation-x={0.9} castShadow>
          <capsuleGeometry args={[0.018, 0.16, 6, 10]} />
        </mesh>
      </group>
      {/* neck */}
      <mesh material={mats.dog} position={[0, 0.55, 0.32 * lengthF]} rotation-x={-0.7} castShadow>
        <cylinderGeometry args={[0.055, 0.085, 0.18, 14]} />
      </mesh>
      {/* head */}
      <group position={[0, 0.65, 0.32 * lengthF + 0.08]}>
        <mesh material={mats.dog} castShadow>
          <sphereGeometry args={[0.085, 18, 14]} />
        </mesh>
        {/* muzzle */}
        <mesh material={mats.dog} position={[0, -0.025, 0.085]} castShadow>
          <boxGeometry args={[0.07, 0.055, 0.09]} />
        </mesh>
        {/* nose */}
        <mesh material={mats.rubber} position={[0, -0.012, 0.135]}>
          <sphereGeometry args={[0.018, 10, 8]} />
        </mesh>
        {/* eyes */}
        {[1, -1].map((s) => (
          <mesh key={s} material={mats.rubber} position={[s * 0.038, 0.025, 0.068]}>
            <sphereGeometry args={[0.011, 8, 8]} />
          </mesh>
        ))}
        {/* ears */}
        {[1, -1].map((s) => (
          <mesh key={s} material={mats.dogDark} position={[s * 0.055, 0.08, -0.01]} rotation-z={s * -0.35} castShadow>
            <coneGeometry args={[0.028, 0.075, 10]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
